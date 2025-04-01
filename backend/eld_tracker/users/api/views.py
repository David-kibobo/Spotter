from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import CarrierSignupSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


# Carrier Signup View
class CarrierSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CarrierSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_carrier(
                email=serializer.validated_data['email'],
                first_name=serializer.validated_data['first_name'],
                last_name=serializer.validated_data['last_name'],
                phone=serializer.validated_data['phone'],
                password=serializer.validated_data['password'],
                carrier_name=serializer.validated_data['carrier_name']
            )
            return Response({"message": "Carrier registered successfully", "user_id": user.id}, status=201)
        return Response(serializer.errors, status=400)


# Login View
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data
            })
        return Response({"error": "Invalid Credentials"}, status=400)


# Get Current User
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
