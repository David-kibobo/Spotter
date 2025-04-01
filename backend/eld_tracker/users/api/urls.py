from django.urls import path
from .views import CarrierSignupView, LoginView, MeView

urlpatterns = [
    path('signup/carrier/', CarrierSignupView.as_view(), name='carrier-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
]
