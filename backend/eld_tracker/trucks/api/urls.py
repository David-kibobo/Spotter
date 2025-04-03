from django.urls import path
from .views import TruckListCreateAPIView, TruckDetailAPIView

urlpatterns = [
    path('', TruckListCreateAPIView.as_view(), name='truck-list-create'),  # GET all trucks & POST a new truck
    path('<uuid:pk>/', TruckDetailAPIView.as_view(), name='truck-detail'),  # GET, PUT, DELETE a single truck
]
