from django.urls import path
from .views import TruckListCreateAPIView, TruckDetailAPIView

urlpatterns = [
    path('trucks/', TruckListCreateAPIView.as_view(), name='truck-list-create'),
    path('trucks/<uuid:pk>/', TruckDetailAPIView.as_view(), name='truck-detail'),
]
