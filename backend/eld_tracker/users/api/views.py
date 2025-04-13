from rest_framework.views import APIView
from uuid import UUID
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework import status
from .serializers import CarrierSignupSerializer, UserSerializer, DriverSignupSerializer, DriverListSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from utils.validators import validate_serializer, validate_hos_rules, validate_8_hour_rule
from utils.responses import success_response, error_response
from ..models  import DriverProfile
User = get_user_model()


# Carrier Signup View
class CarrierSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CarrierSignupSerializer(data=request.data)
        response=validate_serializer(serializer)
        if serializer.is_valid():
            user = User.objects.create_carrier(
                email=serializer.validated_data['email'],
                first_name=serializer.validated_data['first_name'],
                last_name=serializer.validated_data['last_name'],
                phone=serializer.validated_data['phone'],
                password=serializer.validated_data['password'],
                carrier_name=serializer.validated_data['carrier_name']
            )
            return success_response(message= "Carrier registered successfully")
        return response
    
# Creation of drivers by carriers. (Login details to be provided by the carriers to their drivers )    
class DriverCreateView(APIView):
    permission_classes = [IsAuthenticated]  # Only logged-in carriers can create drivers

    def post(self, request):
        user = request.user
        if user.role != "Carrier":
            return error_response( message= "Only carriers can add drivers", status=status.HTTP_403_FORBIDDEN)

        serializer = DriverSignupSerializer(data=request.data)
        response = validate_serializer(serializer)

        if serializer.is_valid():
            driver = User.objects.create_driver(
                email=serializer.validated_data["email"],
                first_name=serializer.validated_data["first_name"],
                last_name=serializer.validated_data["last_name"],
                phone=serializer.validated_data["phone"],
                password=serializer.validated_data["password"],
                carrier=user.carrier,  # Assign the logged-in carrier
                license_number=serializer.validated_data["license_number"],
                truck=serializer.validated_data.get("truck"),  # Optional truck assignment
            )

            return success_response(message="Driver added successfully.")
        return response

class DriverListView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users

    def get(self, request):
        user = request.user
        if user.role != "Carrier":
            return Response({"error": "Only carriers can view drivers"}, status=status.HTTP_403_FORBIDDEN)

        drivers = DriverProfile.objects.filter(carrier=user.carrier)
        serializer = DriverListSerializer(drivers, many=True)

        return success_response(message= "Drivers retrieved successfully", data=serializer.data)
class DriverUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, driver_id):
        user = request.user
        if user.role != "Carrier":
            return error_response(message="Only carriers can update drivers", status=status.HTTP_403_FORBIDDEN)

        try:
            driver_profile = DriverProfile.objects.get(user=driver_id, carrier=user.carrier)
        except DriverProfile.DoesNotExist:
            return error_response(message="Driver not found")

        driver = driver_profile.user
        data = request.data

        # Update user fields
        driver.email = data.get("email", driver.email)
        driver.first_name = data.get("first_name", driver.first_name)
        driver.last_name = data.get("last_name", driver.last_name)
        driver.phone = data.get("phone", driver.phone)

        # Update password if provided
        if data.get("password"):
            driver.set_password(data["password"])
        driver.save()

        # Update profile fields
        driver_profile.license_number = data.get("license_number", driver_profile.license_number)
        driver_profile.truck_id = data.get("truck") or None
        driver_profile.save()

        return success_response(message="Driver updated successfully")
    
# Login View
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return success_response(message={
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data
            })
        return error_response(message= "invalid Credentials")


# Get Current User
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)



class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        # Check if current password is correct
        if not user.check_password(current_password):
            return error_response(message="Current password is incorrect")

        # Check if new passwords match
        if new_password != confirm_password:
            return error_response(message="New passwords do not match")

        # Optionally: Add password validation here (length, strength etc.)

        user.set_password(new_password)
        user.save()

        return success_response(message="Password changed successfully")