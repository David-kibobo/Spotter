from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import make_aware, now
from django.utils.dateparse import parse_date
from datetime import datetime
from django.db.models import Q
from django.utils import timezone
from utils.validators import calculate_hos_hours
from pytz import timezone as pytz_timezone, UnknownTimeZoneError, UTC

from ..models import Trip, TripLog, ELDLog, Trip, DriverProfile, Load
from .serializers import (
    TripSerializer,
    TripLogSerializer,
    ELDLogSerializer,
    LoadSerializer,
)
from utils.common import get_object_or_error
from utils.validators import (
    validate_serializer,
    validate_hos_rules,
    validate_8_hour_rule,
)
from utils.responses import success_response, error_response
from utils.permissions import IsCarrier, IsDriver


# Trip API View for listing, creating, and updating trips
class TripAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCarrier | IsDriver]

    def get(self, request, trip_id=None):
        if trip_id:
            trip = get_object_or_error(Trip, id=trip_id)
            serializer = TripSerializer(trip)
            return success_response("Trip retrieved successfully", serializer.data)

        trips = Trip.objects.all()
        serializer = TripSerializer(trips, many=True)
        return success_response("Trips retrieved successfully", serializer.data)

    def post(self, request):
        if not IsCarrier().has_permission(request, self):
            return error_response("Only carriers can create trips.", 403)
        user = self.request.user
        data = request.data
        data["carrier"] = user.carrier.id

        serializer = TripSerializer(data=request.data)
        error_response_data = validate_serializer(serializer)
        if error_response_data:
            return error_response_data

        serializer.save()
        return success_response("Trip created successfully", serializer.data)

    def patch(self, request, trip_id):
        trip = get_object_or_error(Trip, id=trip_id)

        # If the status is being updated, handle the logic based on the status change
        if "status" in request.data:
            new_status = request.data["status"]

            # Starting the trip (Scheduled -> Ongoing)
            if new_status == "in_progress" and trip.status != "in_progress":
                trip.status = "in_progress"
                trip.start_time = timezone.now()  # Optionally, record the start time
                trip.save()

                return success_response(
                    "Trip status updated to InProgress", TripSerializer(trip).data
                )

            # Ending the trip (Ongoing -> Completed)
            elif new_status == "completed" and trip.status == "in_progress":
                trip.status = "completed"
                trip.end_time = timezone.now()  # Optionally, record the end time
                trip.save()

                return success_response(
                    "Trip status updated to Completed", TripSerializer(trip).data
                )

            # Cancelling the trip (Scheduled -> Cancelled)
            elif new_status == "cancelled" and trip.status == "scheduled":
                trip.status = "cancelled"
                trip.save()

                return success_response(
                    "Trip status updated to Cancelled", TripSerializer(trip).data
                )

            # Invalid status change (e.g., trying to start an already started trip or end a trip that is not ongoing)

            elif trip.status == new_status:
                return error_response(f"Trip is already in the '{new_status}' status.")

            return error_response("Invalid status change.")

        # For other updates (non-status related)
        serializer = TripSerializer(trip, data=request.data, partial=True)
        error_response_data = validate_serializer(serializer)
        if error_response_data:
            return error_response_data

        serializer.save()
        return success_response("Trip updated successfully", serializer.data)


class DriverTripsAPIView(APIView):
    permission_clasess = [IsAuthenticated]

    def get(self, request, driver_id=None):
        if not driver_id:
            return error_response("Driver ID is required.")

        try:
            driver = DriverProfile.objects.get(id=driver_id)
        except DriverProfile.DoesNotExist:
            return error_response("Driver not found.", status=404)

        scheduled_trips = Trip.objects.filter(
            # driver=driver, status__in=["scheduled", "in_progress"]
            driver=driver
        ).order_by("start_time")

        serializer = TripSerializer(scheduled_trips, many=True)
        return success_response(
            "Scheduled trips retrieved for driver.", serializer.data
        )


class DriverHOSStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, driver_id=None):
        try:
            if driver_id:
                driver_profile = DriverProfile.objects.get(id=driver_id)
            else:
                driver_profile = DriverProfile.objects.get(user=request.user)
        except DriverProfile.DoesNotExist:
            return error_response("Driver not found.", status=404)

        date_param = request.query_params.get("date")
        tz_param = request.query_params.get("timezone", "UTC")

        if date_param:
            parsed_date = parse_date(date_param)
            if not parsed_date:
                return error_response(
                    "Invalid date format. Use YYYY-MM-DD.", status=400
                )

            try:
                tz = pytz_timezone(tz_param)
            except UnknownTimeZoneError:
                return error_response("Invalid timezone.", status=400)

            local_start = datetime.combine(parsed_date, datetime.min.time())
            local_start = tz.localize(local_start)
            target_date = local_start.astimezone(UTC)
        else:
            target_date = None

        stats = calculate_hos_hours(driver_profile, target_date)
        return success_response("HOS stats fetched successfully", stats)


class ActiveTripListAPIView(APIView):
    """
    API to get all active trips (scheduled & in progress).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        active_trips = Trip.objects.filter(status__in=["scheduled", "in_progress"])
        serializer = TripSerializer(active_trips, many=True)
        return success_response("Active trips retrieved successfully", serializer.data)


class TripLogListCreateAPIView(APIView):
    """
    GET (with trip_id): Logs for a specific trip.
    GET (without trip_id): Logs for all active trips.
    POST (with trip_id): Add a new log for a specific trip.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, trip_id=None):
        if trip_id:
            trip = get_object_or_error(Trip, id=trip_id)
            logs = TripLog.objects.filter(trip=trip).order_by("-timestamp")
            serializer = TripLogSerializer(logs, many=True)
            return success_response("Trip logs retrieved successfully", serializer.data)

        # 🔥 Get logs for all active trips
        active_trips = Trip.objects.filter(status__in=["in_progress"])
        all_logs = []

        for trip in active_trips:
            logs = trip.logs.order_by("timestamp")
            serialized_logs = TripLogSerializer(logs, many=True).data
            all_logs.extend(serialized_logs)

        return success_response("Logs for all active trips retrieved", all_logs)

    def post(self, request, trip_id):
        trip = get_object_or_error(Trip, id=trip_id)
        data = request.data.copy()
        data["trip"] = trip.id

        serializer = TripLogSerializer(data=data)
        error_response_data = validate_serializer(serializer)
        if error_response_data:
            return error_response_data

        serializer.save()
        return success_response(
            "Trip log created successfully", serializer.data, status.HTTP_201_CREATED
        )


class TripLogDetailAPIView(APIView):
    """
    API to retrieve details of a single trip log.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, log_id):
        log = get_object_or_error(TripLog, id=log_id)
        # if isinstance(log, Response):  # Handle Not Found
        #     return log

        serializer = TripLogSerializer(log)
        return success_response("Trip log retrieved successfully", serializer.data)


class ELDLogListCreateAPIView(APIView):
    """
    API to list all ELD logs and allow manual creation of new logs.
    """

    permission_classes = [IsAuthenticated, IsCarrier | IsDriver]

    def get(self, request, driver_id=None, trip_id=None):
        """
        Retrieve ELD logs, optionally filtered by driver, trip, or date.
        If no driver or trip is passed, returns all logs for today for the carrier.
        """
        carrier = request.user.carrier
        selected_date = request.query_params.get("date")  # Format: YYYY-MM-DD

        logs_qs = ELDLog.objects.none()

        #  Setup date range
        start, end = None, None
        if selected_date:
            try:
                selected_date = datetime.strptime(selected_date, "%Y-%m-%d").date()
            except ValueError:
                return error_response(
                    "Invalid date format. Use YYYY-MM-DD.", status.HTTP_400_BAD_REQUEST
                )
        else:
            # Default to today if no date is passed
            selected_date = now().date()

        start = make_aware(datetime.combine(selected_date, datetime.min.time()))
        end = make_aware(datetime.combine(selected_date, datetime.max.time()))

        #  Filtering logic
        if driver_id:
            driver = get_object_or_error(DriverProfile, id=driver_id)
            logs_qs = ELDLog.objects.filter(driver=driver)

        elif trip_id:
            trip = get_object_or_error(Trip, id=trip_id)
            logs_qs = ELDLog.objects.filter(trip=trip)

        else:
            #  Return all logs for today for the carrier
            logs_qs = ELDLog.objects.filter(driver__carrier=carrier)

        #  Apply date overlap filter
        logs_qs = logs_qs.filter(timestamp__lte=end).filter(
            Q(endtime__isnull=True) | Q(endtime__gte=start)
        )

        logs_qs = logs_qs.select_related("driver", "trip").order_by("-timestamp")

        if not logs_qs.exists():
            return error_response(
                "No logs found for the selected filters.", status.HTTP_404_NOT_FOUND
            )

        serialized_logs = ELDLogSerializer(logs_qs, many=True).data
        return success_response("ELD logs fetched successfully", serialized_logs)

    def post(self, request):
        """
        Allow drivers to manually create an ELD log entry.
        """
        if not IsDriver().has_permission(request, self):
            return error_response("Only drivers can create ELD Logs.", 403)

        serializer = ELDLogSerializer(data=request.data)
        error_response_data = validate_serializer(serializer)
        if error_response_data:
            return error_response_data

        if serializer.is_valid():
            driver = serializer.validated_data["driver"]
            new_status = serializer.validated_data["hos_status"]

            # ✅ Step 1: Validate the 8-hour driving rule
            if new_status == "driving":
                hos_warning = validate_8_hour_rule(driver)
                if hos_warning:
                    return hos_warning

            # ✅ Step 2: Validate other HOS rules
            hos_error = validate_hos_rules(driver, new_status)
            if hos_error:
                return error_response(hos_error, status.HTTP_400_BAD_REQUEST)

            # ✅ Step 3: Close any previous open log
            previous_log = ELDLog.objects.filter(driver=driver, endtime=None).last()
            if previous_log:
                previous_log.endtime = timezone.now()
                previous_log.save()

            # ✅ Step 4: Create the new log entry
            new_log = serializer.save()

            # ✅ Step 5: Update trip actual_distance if log has distance_covered
            distance = getattr(new_log, "distance_covered", None)
            trip = getattr(new_log, "trip", None)

            if distance and trip:
                trip.actual_distance = (trip.actual_distance or 0) + distance
                trip.save()

            return success_response(
                "ELD log created successfully.",
                serializer.data,
                status.HTTP_201_CREATED,
            )

        return error_response("Failed to create ELD log.", status.HTTP_400_BAD_REQUEST)


class ELDLogDetailAPIView(APIView):
    """
    API to retrieve and update a single ELD log entry.
    """

    permission_classes = [IsAuthenticated, IsCarrier | IsDriver]

    def get(self, request, log_id):
        """
        Retrieve details of a single ELD log entry.
        """

        log = get_object_or_error(ELDLog, id=log_id)
        serializer = ELDLogSerializer(log)
        return success_response("ELD log details retrieved.", serializer.data)

    def patch(self, request, log_id):
        """
        Update an ELD log entry (e.g., manual edit by the driver).
        """
        if not IsDriver().has_permission(request, self):
            return error_response("Only drivers can edit ELD Logs.", 403)
        log = get_object_or_error(ELDLog, id=log_id)
        serializer = ELDLogSerializer(log, data=request.data, partial=True)
        error_response_data = validate_serializer(
            serializer
        )  # Capture serializer errors
        if error_response_data:
            return error_response(error_response_data, status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            driver = log.driver
            new_status = serializer.validated_data.get("hos_status", log.hos_status)

            # ✅ Step 1: Validate the 8-hour driving rule
            if new_status == "driving":
                hos_warning = validate_8_hour_rule(driver)
                if hos_warning:
                    return hos_warning  # 🚨 Return warning/error if rule is broken

            # ✅ Step 2: Validate other HOS rules
            hos_error = validate_hos_rules(driver, new_status)
            if hos_error:
                return error_response(hos_error, status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return success_response("ELD log updated successfully.", serializer.data)


class LoadListCreateAPIView(APIView):
    """
    API for listing and creating loads.
    """

    permission_classes = [IsAuthenticated, IsCarrier | IsDriver]

    def get(self, request, trip_id=None):
        """
        Retrieve all loads.
        - If `trip_id` is provided, filter loads for that trip.
        """
        if trip_id:
            loads = Load.objects.filter(trip_id=trip_id)
            if not loads.exists():
                return error_response(
                    "No loads found for the specified trip.", status.HTTP_404_NOT_FOUND
                )
        else:
            loads = Load.objects.all()
            if not loads.exists():
                return error_response("No loads available.", status.HTTP_404_NOT_FOUND)

        serializer = LoadSerializer(loads, many=True)
        return success_response("Loads retrieved successfully.", serializer.data)

    def post(self, request, trip_id):
        """
        Create a new load.
        """
        if not IsCarrier().has_permission(request, self):
            return error_response("Only carriers can create loads.", 403)

        data = request.data
        data["trip"] = trip_id
        trip = Trip.objects.get(id=trip_id)
        serializer = LoadSerializer(data=data)

        error_response_data = validate_serializer(serializer)
        if error_response_data:
            return error_response_data

        # Save the load instance
        load = serializer.save()
        trip.has_load = True
        trip.save()

        # Return success response with serialized load data
        return success_response(
            "Load created successfully.", serializer.data, status.HTTP_201_CREATED
        )


class LoadDetailAPIView(APIView):
    """
    API for retrieving, updating, and deleting a specific load.
    """

    permission_classes = [IsAuthenticated, IsCarrier]

    def get(self, request, load_id):
        """
        Retrieve a single load by ID.
        """
        load = get_object_or_error(Load, id=load_id)
        serializer = LoadSerializer(load)
        return success_response("Load details retrieved.", serializer.data)

    def patch(self, request, load_id):
        """
        Partially update a load.
        """
        load = get_object_or_error(Load, id=load_id)
        serializer = LoadSerializer(load, data=request.data, partial=True)
        error_response_data = validate_serializer(serializer)
        if error_response_data:
            return error_response(error_response_data, status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return success_response("Load updated successfully.", serializer.data)

    def delete(self, request, load_id):
        """
        Delete a load.
        """
        load = get_object_or_error(Load, id=load_id)
        load.delete()
        return success_response(
            "Load deleted successfully.", None, status.HTTP_204_NO_CONTENT
        )
