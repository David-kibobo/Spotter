from rest_framework import status
from rest_framework.views import APIView
from ..models import Truck
from .serializers import TruckSerializer

from utils.responses import success_response, error_response
from utils.validators import validate_serializer
from utils.permissions import IsCarrier
class TruckListCreateAPIView(APIView):
    permission_classes=[IsCarrier]
    def get(self, request):
        """Retrieve all trucks"""
        trucks = Truck.objects.all()
        serializer = TruckSerializer(trucks, many=True)
        return success_response("Trucks retrieved successfully", serializer.data)

    def post(self, request):
        """Create a new truck and assign it to the carrier (logged-in user)"""
        if not hasattr(request.user, "carrier"):
            return error_response("Only carrier accounts can add trucks.", status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()  # Copy request data
        data["carrier"] = str(request.user.carrier.id)  # Ensure carrier is correctly assigned

        serializer = TruckSerializer(data=data)
        response = validate_serializer(serializer)

        if serializer.is_valid():
            serializer.save()
            return success_response("Truck created successfully", serializer.data)

        return response  # Return validation errors

class TruckDetailAPIView(APIView):
    permission_classes = [IsCarrier]
    def get_object(self, pk):
        """Helper method to get a truck by ID"""
        try:
            return Truck.objects.get(pk=pk)
        except Truck.DoesNotExist:
            return None

    def get(self, request, pk):
        """Retrieve a single truck"""
        truck = self.get_object(pk)
        if truck is None:
            return error_response("Truck not found", status=status.HTTP_404_NOT_FOUND)

        serializer = TruckSerializer(truck)
        return success_response("Truck retrieved successfully", serializer.data)

    def put(self, request, pk):
        """Update a truck"""
        truck = self.get_object(pk)
        if truck is None:
            return error_response("Truck not found", status=status.HTTP_404_NOT_FOUND)
        user=request.user
        data=request.data
        data['carrier']= str(user.carrier.id)
        serializer = TruckSerializer(truck, data=request.data)
        response = validate_serializer(serializer)
        if serializer.is_valid():
            serializer.save()
            return success_response("Truck updated successfully", serializer.data)
        return response  # This will return the validation error

    def delete(self, request, pk):
        """Delete a truck"""
        truck = self.get_object(pk)
        if truck is None:
            return error_response("Truck not found", status=status.HTTP_404_NOT_FOUND)

        truck.delete()
        return success_response("Truck deleted successfully", None, status=status.HTTP_204_NO_CONTENT)
