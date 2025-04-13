from django.urls import path
from uuid import UUID
from .views import CarrierSignupView, LoginView, MeView, DriverCreateView,DriverListView,DriverUpdateView, ChangePasswordView

urlpatterns = [
    path('signup/carrier/', CarrierSignupView.as_view(), name='carrier-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('drivers/create/', DriverCreateView.as_view(), name='driver-signup'),
    path('drivers/get/', DriverListView.as_view(), name='drivers-list'),
    path("drivers/<uuid:driver_id>/update/", DriverUpdateView.as_view(), name="update-driver"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),

]
