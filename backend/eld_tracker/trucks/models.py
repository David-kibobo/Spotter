from django.db import models
import uuid

class Truck(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    carrier = models.ForeignKey("users.Carrier", on_delete=models.CASCADE, related_name="trucks")  # Use string reference
    truck_number = models.CharField(max_length=50, unique=True)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    vin = models.CharField(max_length=17, unique=True)  # Vehicle Identification Number
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.truck_number} - {self.make} {self.model} ({self.year})"