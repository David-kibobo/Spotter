from django.contrib import admin
from .models import Trip, TripLog, Load, ELDLog

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ("id", "truck", "driver", "start_location", "destination", "status", "start_time", "end_time")
    list_filter = ("status", "carrier")
    search_fields = ("truck__truck_number", "driver__user__first_name", "driver__user__last_name", "start_location", "destination")

@admin.register(TripLog)
class TripLogAdmin(admin.ModelAdmin):
    list_display = ("id", "trip", "timestamp", "latitude", "longitude", "speed", "source")
    list_filter = ("source",)
    search_fields = ("trip__truck__truck_number", "location_name")

@admin.register(Load)
class LoadAdmin(admin.ModelAdmin):
    list_display = ("id", "trip", "description", "weight", "pickup_location", "delivery_location", "status")
    list_filter = ("status",)
    search_fields = ("pickup_location", "delivery_location")

@admin.register(ELDLog)
class ELDLogAdmin(admin.ModelAdmin):
    list_display = ("id", "driver", "trip", "timestamp", "hos_status", "total_hours_past_24", "total_hours_past_8_days", "distance_covered")
    list_filter = ("hos_status", "manual_edit", "malfunction_flag")
    search_fields = ("driver__user__first_name", "driver__user__last_name", "location_name")
