from django.contrib import admin
from .models import Trip, TripLog, Load, ELDLog

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ("id", "truck", "driver", "start_location", "destination_location", "status", "start_time", "end_time")
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
# class ELDLogAdmin(admin.ModelAdmin):
#     list_display = ['id', 'trip', 'hos_status',  'distance_covered']
#     list_filter = ['trip', 'hos_status']
#     search_fields = ['trip__id', 'hos_status']
#     list_editable = ['trip']  # Make the `trip` field editable directly in the list view
#     actions = ['assign_trip_to_selected_logs']

#     def assign_trip_to_selected_logs(self, request, queryset):
#         # Here, you can assign a trip to all selected ELDLogs
#         trip_id = request.POST.get('trip_id')
#         if trip_id:
#             trip = Trip.objects.get(id=trip_id)
#             queryset.update(trip=trip)  # This assigns the selected trip to all selected ELDLogs
#             self.message_user(request, f'Successfully assigned Trip {trip_id} to {queryset.count()} ELDLogs.')
#         else:
#             self.message_user(request, 'Please select a trip to assign.')

#     assign_trip_to_selected_logs.short_description = 'Assign selected ELDLogs to a Trip'

# admin.site.register(ELDLog, ELDLogAdmin)
