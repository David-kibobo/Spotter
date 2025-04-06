from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta
from django.utils.timezone import now
from logistics.models import ELDLog
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


def validate_fueling_requirement(driver):
    """
    Ensure fueling is logged at least once every 1000 miles.
    """
    last_fueling = ELDLog.objects.filter(driver=driver, hos_status="on_duty", remarks="Fueling").order_by('-timestamp').first()
    
    last_log = ELDLog.objects.filter(driver=driver).order_by('-timestamp').first()
    total_distance_since_fueling = last_log.distance_covered if last_fueling else 0  # Fixed retrieval

    if total_distance_since_fueling >= 1000:
        return error_response("Fueling must be logged at least once every 1000 miles.")

    return None  # No error


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


def calculate_hos_hours(driver):
    """
    Correct HOS calculation to avoid double counting.
    """
    now_time = now()
    past_24_hours = now_time - timedelta(hours=24)
    past_8_days = now_time - timedelta(days=8)
    past_5_days = now_time - timedelta(days=5)

    # Fetch logs within timeframes but filter ONLY "On-Duty" and "Driving" statuses
    logs_last_24h = ELDLog.objects.filter(driver=driver, timestamp__gte=past_24_hours, hos_status__in=["on_duty", "driving"])
    logs_last_8d = ELDLog.objects.filter(driver=driver, timestamp__gte=past_8_days, hos_status__in=["on_duty", "driving"])
    logs_last_5d = ELDLog.objects.filter(driver=driver, timestamp__gte=past_5_days, hos_status__in=["on_duty", "driving"])

    # Calculate total hours dynamically based on time differences
    total_hours_24h = sum(
        ((log.endtime or now_time) - log.timestamp).total_seconds() / 3600
        for log in logs_last_24h
    )
    total_hours_8d = sum(
        ((log.endtime or now_time) - log.timestamp).total_seconds() / 3600
        for log in logs_last_8d
    )
    total_hours_5d = sum(
        ((log.endtime or now_time) - log.timestamp).total_seconds() / 3600
        for log in logs_last_5d
    )

    # Available hours tomorrow based on the correct 70-hour calculation
    available_hours_tomorrow = max(0, 70 - total_hours_8d)

    # Check for 34-hour reset
    last_off_duty = ELDLog.objects.filter(driver=driver, hos_status="off_duty").order_by("-timestamp").first()
    consecutive_off_duty_hours = 0

    if last_off_duty:
        off_duty_duration = now_time - last_off_duty.timestamp
        if off_duty_duration >= timedelta(hours=34):
            total_hours_8d = 0  # Reset HOS counter
            consecutive_off_duty_hours = 34

    return {
        "total_hours_past_24": total_hours_24h,
        "total_hours_past_8_days": total_hours_8d,
        "total_hours_last_5_days": total_hours_5d,
        "available_hours_tomorrow": available_hours_tomorrow,
        "consecutive_off_duty_hours": consecutive_off_duty_hours,
    }




def validate_8_hour_rule(driver):
    """
    Validate that the driver has not driven more than 8 consecutive hours without a break.
    If driving exceeds 7.5 hours, return an automatic break suggestion.
    If driving reaches 8 hours, block further driving.
    """

    last_8_hours_logs = ELDLog.objects.filter(
        driver=driver, timestamp__gte=now() - timedelta(hours=8)
    ).order_by("timestamp")

    consecutive_driving_time = timedelta(0)
    last_driving_timestamp = None

    for log in last_8_hours_logs:
        if log.hos_status == "driving":
            if last_driving_timestamp is None:
                last_driving_timestamp = log.timestamp  
        else:
            if last_driving_timestamp:
                consecutive_driving_time += log.timestamp - last_driving_timestamp  
                last_driving_timestamp = None  

        # Reset driving time if a break is taken
        if log.hos_status in ["off_duty", "sleeper_berth"]:
            consecutive_driving_time = timedelta(0)

    if last_driving_timestamp:
        consecutive_driving_time += now() - last_driving_timestamp

    driving_hours = consecutive_driving_time.total_seconds() / 3600  

    # 🔹 Early warning at 7.5 hours
    if 7.5 <= driving_hours < 8:
        return success_response(
            "🚨 Warning: You have been driving for 7.5 hours. Please take a 30-minute break soon!"
        )

    # 🚨 Block driving after 8 hours
    if driving_hours >= 8:
        return error_response(
            "❌ HOS Rule: You must take a 30-minute break after 8 consecutive hours of driving."
        )

    return None  # No violation