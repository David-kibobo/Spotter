from rest_framework import serializers
from logistics.models import Trip, TripLog, Load, ELDLog
from users.api.serializers import UserSerializer, DriverListSerializer
from trucks.api.serializers import TruckSerializer
from utils.validators import (
    validate_fueling_requirement, 
    validate_hos_rules, 
    calculate_hos_hours
)
from utils.responses import error_response

class TripSerializer(serializers.ModelSerializer):
    driver_data = DriverListSerializer(source="driver", read_only=True)
    truck_data = TruckSerializer(source="truck", read_only=True)
    class Meta:
        model = Trip
        fields = "__all__"


class TripLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripLog
        fields = "__all__"


class LoadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Load
        fields = "__all__"


class ELDLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ELDLog
        fields = "__all__"

    def validate(self, data):
        """
        Apply HOS rule validation before saving an ELD log.
        """
        driver = data.get("driver")
        new_status = data.get("hos_status")

        # Validate fueling requirement if the driver is driving/on duty
        if new_status in ["driving", "on_duty"]:
            fueling_check = validate_fueling_requirement(driver)
            if fueling_check:
                raise serializers.ValidationError(fueling_check.data["message"])

        # Validate HOS rules (transitions, limits, 8-hour break)
        hos_check = validate_hos_rules(driver, new_status)

        if hos_check:
            # Ensure hos_check is a dictionary with a 'message' key
            if "message" in hos_check:
                raise serializers.ValidationError(hos_check["message"])
            else:
                raise serializers.ValidationError("HOS validation failed with no message.")

        return data
    def create(self, validated_data):
        """
        Custom create method to update HOS compliance fields before saving.
        """
        driver = validated_data["driver"]
        new_status = validated_data["hos_status"]

        # Get updated HOS calculations
        hos_data = calculate_hos_hours(driver)

        # Apply reset if the driver has taken 34 hours Off-Duty
        if hos_data["consecutive_off_duty_hours"] >= 34:
            validated_data["total_hours_past_24"] = 0
            validated_data["total_hours_past_8_days"] = 0
            validated_data["total_hours_last_5_days"] = 0
            validated_data["available_hours_tomorrow"] = 70
            validated_data["consecutive_off_duty_hours"] = 0
        else:
            # Update HOS tracking fields
            validated_data["total_hours_past_24"] = hos_data["total_hours_past_24"]
            validated_data["total_hours_past_8_days"] = hos_data["total_hours_past_8_days"]
            validated_data["total_hours_last_5_days"] = hos_data["total_hours_last_5_days"]
            validated_data["available_hours_tomorrow"] = hos_data["available_hours_tomorrow"]
            validated_data["consecutive_off_duty_hours"] = hos_data["consecutive_off_duty_hours"]

        validated_data["hos_status"] = new_status

        # Save the new log entry
        return super().create(validated_data)
