from rest_framework.views import APIView
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
