from django.urls import path
from .views import TripAPIView, ActiveTripListAPIView, TripLogListCreateAPIView, DriverTripsAPIView, DriverHOSStatsAPIView, TripLogDetailAPIView, ELDLogListCreateAPIView, ELDLogDetailAPIView, LoadListCreateAPIView, LoadDetailAPIView

urlpatterns = [
    # Trip API Endpoints
    path('trips/', TripAPIView.as_view(), name='trip-list-create'),
    path('trips/<uuid:trip_id>/', TripAPIView.as_view(), name='trip-detail-update'),
    path('active-trips/', ActiveTripListAPIView.as_view(), name='active-trip-list'),
    path('driver-trips/<int:driver_id>/', DriverTripsAPIView.as_view(), name='driver-trips'),
 


    # TripLog API Endpoints
    path("trip-logs/", TripLogListCreateAPIView.as_view(), name="all-active-trip-logs"),
    path('trips/<uuid:trip_id>/logs/', TripLogListCreateAPIView.as_view(), name='trip-log-list-create'),
    path('trips/logs/<uuid:log_id>/', TripLogDetailAPIView.as_view(), name='trip-log-detail'),
    

    # ELDLog API Endpoints
    path('eld-logs/', ELDLogListCreateAPIView.as_view(), name='eld-log-list-create'),
    path('eld-logs/<uuid:log_id>/', ELDLogDetailAPIView.as_view(), name='eld-log-detail'),
    path('eld-logs/driver/<int:driver_id>/', ELDLogListCreateAPIView.as_view(), name='eld-log-driver'),
    path('eld-logs/trip/<uuid:trip_id>/', ELDLogListCreateAPIView.as_view(), name='eld-log-trip'),

    # Load API Endpoints
    path('loads/', LoadListCreateAPIView.as_view(), name='load-list-create'),
    path('loads/<uuid:trip_id>/', LoadListCreateAPIView.as_view(), name='load-list-create'),
    path('loads/<uuid:load_id>/', LoadDetailAPIView.as_view(), name='load-detail'),
    
    # Driver HosStats
 

    path("hos/stats/<int:driver_id>/", DriverHOSStatsAPIView.as_view(), name="hos-stats"),


]
