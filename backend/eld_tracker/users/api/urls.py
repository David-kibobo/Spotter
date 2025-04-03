from django.urls import path
from .views import CarrierSignupView, LoginView, MeView, DriverCreateView,DriverListView

urlpatterns = [
    path('signup/carrier/', CarrierSignupView.as_view(), name='carrier-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('drivers/create/', DriverCreateView.as_view(), name='driver-signup'),
    path('drivers/get/', DriverListView.as_view(), name='drivers-list'),
]
