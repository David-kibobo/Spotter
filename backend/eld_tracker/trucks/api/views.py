from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Truck
from .serializers import TruckSerializer

class TruckListCreateAPIView(APIView):
    def get(self, request):
        trucks = Truck.objects.all()
        serializer = TruckSerializer(trucks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TruckSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TruckDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Truck.objects.get(pk=pk)
        except Truck.DoesNotExist:
            return None

    def get(self, request, pk):
        truck = self.get_object(pk)
        if truck is None:
            return Response({"error": "Truck not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TruckSerializer(truck)
        return Response(serializer.data)

    def put(self, request, pk):
        truck = self.get_object(pk)
        if truck is None:
            return Response({"error": "Truck not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TruckSerializer(truck, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        truck = self.get_object(pk)
        if truck is None:
            return Response({"error": "Truck not found"}, status=status.HTTP_404_NOT_FOUND)
        truck.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
