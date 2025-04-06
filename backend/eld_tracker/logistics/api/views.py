from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from ..models import Trip, TripLog,ELDLog, Trip, DriverProfile, Load
from .serializers import TripSerializer, TripLogSerializer, ELDLogSerializer, LoadSerializer
from utils.common import get_object_or_error
from utils.validators import validate_serializer, validate_hos_rules, validate_8_hour_rule
from utils.responses import success_response, error_response

# Trip API View for listing, creating, and updating trips
class TripAPIView(APIView):
    def get(self, request, trip_id=None):
        if trip_id:
            trip = get_object_or_error(Trip, id=trip_id)
            serializer = TripSerializer(trip)
            return success_response("Trip retrieved successfully", serializer.data)

        trips = Trip.objects.all()
        serializer = TripSerializer(trips, many=True)
        return success_response("Trips retrieved successfully", serializer.data)

    def post(self, request):
        user=self.request.user
        data=request.data 
        data['carrier']=user.carrier.id
        
        serializer = TripSerializer(data=request.data)
        error_response_data = validate_serializer(serializer)
        if error_response_data:
            return error_response_data
        
        serializer.save()
        return success_response("Trip created successfully", serializer.data)

    def patch(self, request, trip_id):
        trip = get_object_or_error(Trip, id=trip_id)
        serializer = TripSerializer(trip, data=request.data, partial=True)
        error_response_data = validate_serializer(serializer)
        if error_response_data:
            return error_response_data
        
        serializer.save()
        return success_response("Trip updated successfully", serializer.data)

class ActiveTripListAPIView(APIView):
    """
    API to get all active trips (scheduled & in progress).
    """
    def get(self, request):
        active_trips = Trip.objects.filter(status__in=["scheduled", "in_progress"])
        serializer = TripSerializer(active_trips, many=True)
        return success_response("Active trips retrieved successfully", serializer.data)


class TripLogListCreateAPIView(APIView):
    """
    API to list all logs for a trip and allow manual log creation.
    """

    def get(self, request, trip_id):
        trip = get_object_or_error(Trip, id=trip_id)
        # if isinstance(trip, Response):  # Handle Not Found
        #     return trip

        logs = TripLog.objects.filter(trip=trip).order_by("-timestamp")
        serializer = TripLogSerializer(logs, many=True)
        return success_response("Trip logs retrieved successfully", serializer.data)

    def post(self, request, trip_id):
        trip = get_object_or_error(Trip, id=trip_id)
        # if isinstance(trip, Response):  # Handle Not Found
        #     return trip

        data = request.data.copy()
        data["trip"] = trip.id  
        serializer = TripLogSerializer(data=data)
        
        error_response_data = validate_serializer(serializer)
        if error_response_data:
            return error_response_data  

        serializer.save()
        return success_response("Trip log created successfully", serializer.data, status.HTTP_201_CREATED)


class TripLogDetailAPIView(APIView):
    """
    API to retrieve details of a single trip log.
    """

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
    
    
class ELDLogListCreateAPIView(APIView):
    """
    API to list all ELD logs and allow manual creation of new logs.
    """

    def get(self, request, driver_id=None, trip_id=None):
        """
        Retrieve all ELD logs for a specific driver or trip.
        """
        carrier = request.user.carrier
        if driver_id:
            driver = get_object_or_error(DriverProfile, id=driver_id)
            logs = ELDLog.objects.filter(driver=driver).order_by("-timestamp")
            if not logs.exists():
                return error_response("No logs found for the specified driver", status.HTTP_404_NOT_FOUND)
        elif trip_id:
            trip = get_object_or_error(Trip, id=trip_id)
            logs = ELDLog.objects.filter(trip=trip).order_by("-timestamp")
            if not logs.exists():
                return error_response("No logs found for the specified trip", status.HTTP_404_NOT_FOUND)
        else:
            logs = ELDLog.objects.filter(driver__carrier=carrier).order_by("-timestamp")
            if not logs.exists():
                return error_response("No logs have been created yet", status.HTTP_404_NOT_FOUND)

        serializer = ELDLogSerializer(logs, many=True)
        return success_response("ELD logs retrieved successfully.", serializer.data)

    def post(self, request):
        """
        Allow drivers to manually create an ELD log entry.
        """
        serializer = ELDLogSerializer(data=request.data)
        error_response_data = validate_serializer(serializer)  # Capture serializer errors
        if error_response_data:
            return error_response_data
        
        if serializer.is_valid():
            driver = serializer.validated_data["driver"]
            new_status = serializer.validated_data["hos_status"]

            # ✅ Step 1: Validate the 8-hour driving rule
            if new_status == "driving":
                hos_warning = validate_8_hour_rule(driver)
                if hos_warning:
                    return hos_warning  # 🚨 Return early if rule violated

            # ✅ Step 2: Validate other HOS rules
            hos_error = validate_hos_rules(driver, new_status)
            if hos_error:
                return error_response(hos_error, status.HTTP_400_BAD_REQUEST)

            # ✅ Step 3: Check if the previous log exists with an open status
            previous_log = ELDLog.objects.filter(driver=driver, endtime=None).last()

            if previous_log:
                # Close the previous log by setting endtime to the current time
                previous_log.endtime = timezone.now()
                previous_log.save()

            # ✅ Step 4: Create the new log entry with the new status
            serializer.save()  
            return success_response("ELD log created successfully.", serializer.data, status.HTTP_201_CREATED)

        return error_response("Failed to create ELD log.", status.HTTP_400_BAD_REQUEST)
        
class ELDLogDetailAPIView(APIView):
    """
    API to retrieve and update a single ELD log entry.
    """

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
        log = get_object_or_error(ELDLog, id=log_id)
        serializer = ELDLogSerializer(log, data=request.data, partial=True)
        error_response_data = validate_serializer(serializer)  # Capture serializer errors
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

    permission_classes = [IsAuthenticated]

    def get(self, request, trip_id=None):
        """
        Retrieve all loads.
        - If `trip_id` is provided, filter loads for that trip.
        """
        if trip_id:
            loads = Load.objects.filter(trip_id=trip_id)
            if not loads.exists():
                return error_response("No loads found for the specified trip.", status.HTTP_404_NOT_FOUND)
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
        print("My data:",request.data)
        data=request.data
        data['trip']=trip_id
        trip=Trip.objects.get(id=trip_id)
        serializer = LoadSerializer(data=data)
        
        error_response_data = validate_serializer(serializer)
        if error_response_data:
            return error_response_data

        # Save the load instance
        load = serializer.save()
        trip.has_load=True
        trip.save()
        

        # Return success response with serialized load data
        return success_response("Load created successfully.", serializer.data, status.HTTP_201_CREATED)
class LoadDetailAPIView(APIView):
    """
    API for retrieving, updating, and deleting a specific load.
    """

    permission_classes = [IsAuthenticated]

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
        return success_response("Load deleted successfully.", None, status.HTTP_204_NO_CONTENT)