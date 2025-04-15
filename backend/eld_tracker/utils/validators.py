from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta, datetime
from django.utils.timezone import now, make_aware
from logistics.models import ELDLog, Trip

from utils.responses import error_response, success_response  # Import custom response functions
from rest_framework.exceptions import ValidationError

def format_serializer_errors(errors):
    formatted_errors = []
    for field, messages in errors.items():
        field_name = field.replace('_', ' ').capitalize()
        for message in messages:
            if field == "non_field_errors":
                formatted_errors.append(f"{message}")
            else:
                formatted_errors.append(f"{field_name}: {message}")
    return formatted_errors


def validate_serializer(serializer):
    """
    Handles serializer validation errors and returns a formatted response.
    """
    if not serializer.is_valid():
        errors = format_serializer_errors(serializer.errors)
        return error_response(errors)
    return None  # No error

# Define valid status transitions
VALID_TRANSITIONS = {
    "off_duty": ["on_duty", "sleeper_berth"],
    "on_duty": ["driving", "off_duty"],
    "driving": ["on_duty", "sleeper_berth"],
    "sleeper_berth": ["on_duty", "off_duty"],
}

def validate_hos_rules(driver, new_status):
    """
    Validate all Hours of Service (HOS) rules before allowing a status update.
    """

    # Get the latest log entry for this driver
    last_log = ELDLog.objects.filter(driver=driver).order_by("-timestamp").first()

    if last_log:
        last_status = last_log.hos_status

        # Ensure status transitions are valid
        if new_status not in VALID_TRANSITIONS.get(last_status, []):
            return {"message": f"Invalid HOS transition: Cannot change from {last_status} to {new_status}."}

    # Fetch logs for the past 24 hours and 8 days
    hos_data = calculate_hos_hours(driver)

    # Validate HOS limits
    if new_status == "driving":
        if hos_data["total_hours_past_24"] >= 11:
            return {"message": "HOS Rule: You cannot drive more than 11 hours in a 24-hour period."}
        if hos_data["total_hours_past_8_days"] >= 70:
            return {"message": "HOS Rule: You cannot drive more than 70 hours in 8 days."}

        # Ensure a 30-minute break after 8 hours of driving
        eight_hour_check = validate_8_hour_rule(driver)
        if eight_hour_check:
            return eight_hour_check  # Return error if check fails

    return None  # No error, status update is valid


def get_distance_covered_for_date(driver, date):
    start = date.replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + timedelta(days=1)

    logs = ELDLog.objects.filter(driver=driver, timestamp__range=(start, end)).order_by("-timestamp")

    active_trips = Trip.objects.filter(driver=driver, start_time__lte=end, end_time__gte=start, status="in_progress")
    if not logs.exists() or not active_trips.exists():
        return 0
    
    return logs.first().distance_covered



def validate_fueling_requirement(incoming_log):
    """
    Validates that fueling has occurred within the last 1000 miles of the trip.
    Allows fueling logs to pass through.
    """
    driver = incoming_log.driver
    trip = incoming_log.trip

    # If it's a fueling log, allow it
    if incoming_log.is_fueling:
        return None

    if not trip:
        return None  # If no trip is associated, skip this validation

    # Fetch logs in this trip for the same driver
    trip_logs = ELDLog.objects.filter(driver=driver, trip=trip).order_by('timestamp')

    last_fueling_log = trip_logs.filter(is_fueling=True).order_by('-timestamp').first()
    last_log = trip_logs.order_by('-timestamp').first()

    total_distance_since_fueling = 0
    if last_log and last_fueling_log:
        total_distance_since_fueling = (last_log.distance_covered or 0) - (last_fueling_log.distance_covered or 0)
    elif last_log:
        total_distance_since_fueling = last_log.distance_covered or 0

    if total_distance_since_fueling >= 1000:
        return error_response("Fueling is required at least once every 1000 miles within this trip.")

    return None



def validate_pickup_dropoff_time(trip):
    """
    Ensure at least 1 hour is spent at pickup and drop-off locations.
    """
    pickup_logs = ELDLog.objects.filter(trip=trip, hos_status="on_duty", remarks="Pickup").order_by("timestamp")
    dropoff_logs = ELDLog.objects.filter(trip=trip, hos_status="on_duty", remarks="Dropoff").order_by("timestamp")

    if pickup_logs.exists():
        pickup_duration = pickup_logs.last().timestamp - pickup_logs.first().timestamp
        if pickup_duration < timedelta(hours=1):
            return error_response("Pickup must be logged for at least 1 hour.")

    if dropoff_logs.exists():
        dropoff_duration = dropoff_logs.last().timestamp - dropoff_logs.first().timestamp
        if dropoff_duration < timedelta(hours=1):
            return error_response("Drop-off must be logged for at least 1 hour.")

    return None  # No error



def calculate_hos_hours(driver, target_date=None):
    # Use current time if no date is provided
    target_date = target_date or now()
    if isinstance(target_date, datetime) and target_date.tzinfo is None:
        target_date = make_aware(target_date)

    start_of_day = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day + timedelta(days=1)

    # Relative windows
    past_24_hours = target_date - timedelta(hours=24)
    past_8_days = target_date - timedelta(days=8)
    past_5_days = target_date - timedelta(days=5)

    # Logs for HOS
    logs_24h = ELDLog.objects.filter(
        driver=driver, timestamp__gte=past_24_hours, timestamp__lt=target_date,
        hos_status__in=["on_duty", "driving"]
    )
    logs_8d = ELDLog.objects.filter(
        driver=driver, timestamp__gte=past_8_days, timestamp__lt=target_date,
        hos_status__in=["on_duty", "driving"]
    )
    logs_5d = ELDLog.objects.filter(
        driver=driver, timestamp__gte=past_5_days, timestamp__lt=target_date,
        hos_status__in=["on_duty", "driving"]
    )

    def get_duration(log):
        end = log.endtime or target_date
        return (end - log.timestamp).total_seconds() / 3600

    total_hours_24h = sum(get_duration(log) for log in logs_24h)
    total_hours_8d = sum(get_duration(log) for log in logs_8d)
    total_hours_5d = sum(get_duration(log) for log in logs_5d)

    # Reset rule — still checks current HOS state (doesn't need date filter)
    off_duty_hours = calculate_consecutive_off_duty_hours(driver)
    if off_duty_hours >= 34:
        total_hours_8d = 0

    available_hours_tomorrow = max(0, 70 - total_hours_8d)

    # Get miles for the specific date
    total_miles = get_distance_covered_for_date(driver, target_date)

    # Fueling miles (optional logic — latest up to target_date)
    latest_log = ELDLog.objects.filter(driver=driver, timestamp__lte=target_date).order_by("-timestamp").first()
    last_fueling_log = ELDLog.objects.filter(
        driver=driver, hos_status="on_duty", remarks="Fueling", timestamp__lte=target_date
    ).order_by("-timestamp").first()

    last_fueling_miles = 0
    if last_fueling_log and latest_log:
        last_fueling_miles = latest_log.distance_covered - last_fueling_log.distance_covered

    return {
        "total_hours_past_24": round(total_hours_24h, 2),
        "total_hours_past_8_days": round(total_hours_8d, 2),
        "total_hours_last_5_days": round(total_hours_5d, 2),
        "available_hours_tomorrow": round(available_hours_tomorrow, 2),
        "consecutive_off_duty_hours": round(off_duty_hours, 2),
        "totalMiles": round(total_miles, 2),
        "lastFuelingMiles": round(last_fueling_miles, 2)
    }
def validate_8_hour_rule(driver):
    """
    Enforce the 8-hour rule: A driver must take a 30-minute break after 8 consecutive hours of driving.
    """
    now_time = now()
    eight_hours_ago = now_time - timedelta(hours=8)

    logs = (
        ELDLog.objects.filter(driver=driver, timestamp__gte=eight_hours_ago)
        .order_by("timestamp")
    )

    consecutive_driving_time = timedelta(0)

    for log in logs:
        log_start = log.timestamp
        log_end = log.endtime or now_time

        if log.hos_status == "driving":
            # Add the time spent in this driving log
            duration = log_end - log_start
            consecutive_driving_time += duration
        elif log.hos_status in ["off_duty", "sleeper_berth"]:
            # Reset the counter — break taken
            consecutive_driving_time = timedelta(0)
        else:
            # On-duty (not driving): don't reset, but pause the streak
            pass  # no-op

        if consecutive_driving_time >= timedelta(hours=8):
            return error_response(
                "❌ HOS Rule: You must take a 30-minute break after 8 consecutive hours of driving."
            )

    if timedelta(hours=7.5) <= consecutive_driving_time < timedelta(hours=8):
        return success_response(
            "🚨 Warning: You have been driving for 7.5 hours. Please take a 30-minute break soon!"
        )

    return None  # All good

def calculate_consecutive_off_duty_hours(driver):
    now_time = now()
    logs = ELDLog.objects.filter(driver=driver).order_by("-timestamp")

    total_off_duty = timedelta(0)
    last_end_time = now_time

    for log in logs:
        if log.hos_status != "off_duty":
            break  # streak is broken, stop here

        log_end = log.endtime or now_time
        log_start = log.timestamp

        # Make sure it's consecutive: previous end must match this log's end
        if log_end <= last_end_time:
            total_off_duty += log_end - log_start
            last_end_time = log_start  # move the streak boundary back
        else:
            break  # not consecutive

    return total_off_duty.total_seconds() / 3600  # convert to hours
