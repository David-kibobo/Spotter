from django.db import models
import uuid
from users.models import Carrier, DriverProfile
from trucks.models import Truck



TRIP_STATUS_CHOICES = [
    ("scheduled", "Scheduled"),
    ("in_progress", "In Progress"),
    ("completed", "Completed"),
    ("canceled", "Canceled"),
    
]


TRIPLOG_SOURCE_CHOICES = [
    ("map_api", "Map API"),
    ("manual", "Manual Entry"),
    ("simulated", "Simulated Entry"),
]


LOAD_STATUS_CHOICES = [
    ("pending", "Pending"),
    ("in_transit", "In Transit"),
    ("delivered", "Delivered"),
    ("canceled", "Canceled"),
]
HOS_STATUS_CHOICES = [
    ("off_duty", "Off Duty"),
    ("sleeper_berth", "Sleeper Berth"),
    ("driving", "Driving"),
    ("on_duty", "On Duty (Not Driving)"),
]
class Trip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    carrier = models.ForeignKey(Carrier, on_delete=models.CASCADE, related_name="trips")
    truck = models.ForeignKey(Truck, on_delete=models.CASCADE, related_name="trips")
    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name="trips")
    start_location = models.CharField(max_length=255)  # Store address or city name
    start_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    start_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    destination_location = models.CharField(max_length=255)  # Store address or city name
    destination_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    destination_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    estimated_distance = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, help_text="Estimated miles")
    actual_distance = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, help_text="Miles covered based on logs")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=TRIP_STATUS_CHOICES, default="scheduled")
    has_load=models.BooleanField(default =False)

    def __str__(self):
        return f"{self.truck.truck_number} - {self.start_location} to {self.destination_location}"

class TripLog(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="logs")
    timestamp = models.DateTimeField(auto_now_add=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    speed = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Speed in mph")
    location_name = models.CharField(max_length=255, null=True, blank=True, help_text="Reverse geocoded location name")
    source = models.CharField(max_length=20, choices=TRIPLOG_SOURCE_CHOICES, default="map_api")

    def __str__(self):
        return f"TripLog {self.id} - {self.trip.truck.truck_number} at {self.timestamp}"

class Load(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="loads")

    description = models.TextField(help_text="Brief load description")
    commodity = models.CharField(max_length=100, blank=True, null=True)
    shipper = models.CharField(max_length=100, blank=True, null =True )
    weight = models.DecimalField(max_digits=6, decimal_places=2, help_text="Weight in tons")

    pickup_location = models.CharField(max_length=255)
    pickup_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    pickup_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    delivery_location = models.CharField(max_length=255)
    delivery_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    delivery_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    pickup_time = models.DateTimeField()
    delivery_time = models.DateTimeField(null=True, blank=True)

    status = models.CharField(max_length=20, choices=LOAD_STATUS_CHOICES, default="pending")

    def __str__(self):
        return f"{self.pickup_location} to {self.delivery_location}"

class ELDLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name="eld_logs")
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="eld_logs", null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)  # Log entry time
    endtime = models.DateTimeField(null=True, blank=True) #log endtime
    hos_status = models.CharField(max_length=20, choices=HOS_STATUS_CHOICES)

    # Location Tracking
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_name = models.CharField(max_length=255, null=True, blank=True, help_text="Reverse geocoded location name")

    # HOS Compliance Fields
    total_hours_past_24 = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Total driving/on-duty hours in past 24 hours")
    total_hours_past_8_days = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Total hours driven in past 8 days (70-hour rule)")
    total_hours_last_5_days = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Total on-duty hours for the last 5 days")
    available_hours_tomorrow = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Hours available tomorrow after HOS calculations")
    consecutive_off_duty_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Consecutive off-duty hours for 34-hour reset")

    # Fueling & Distance Tracking
    distance_covered = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, help_text="Miles covered since last log")
    is_fueling = models.BooleanField(default=False, help_text="True if this log entry represents a fueling event")

    # Additional Fields
    remarks = models.TextField(null=True, blank=True, help_text="Driver comments or system-generated remarks")
    manual_edit = models.BooleanField(default=False, help_text="True if log was manually edited")
    malfunction_flag = models.BooleanField(default=False, help_text="True if there was a system malfunction")

    def __str__(self):
        return f"ELDLog {self.id} - {self.driver.user.get_full_name()} - {self.hos_status} at {self.timestamp}"
