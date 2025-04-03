from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import Carrier, DriverProfile
from trucks.models import Truck

User = get_user_model()


# Carrier Signup Serializer
class CarrierSignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)
    carrier_name = serializers.CharField(max_length=255)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'role', 'carrier')

# Driver creation serializer
class DriverSignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True, min_length=6)
    license_number = serializers.CharField(max_length=50)
    truck = serializers.PrimaryKeyRelatedField(queryset=Truck.objects.all(), required=False, allow_null=True)  # Optional truck

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return value
class DriverListSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DriverProfile
        fields = ["id", "user", "license_number", "truck"]

    def get_user(self, obj):
        """Returns user details as a nested object"""
        return {
            "id": obj.user.id,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
            "email": obj.user.email,
            "phone": str(obj.user.phone),
            "date_joined": obj.user.date_joined,
        }
