from django.db import models
import uuid
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from phonenumber_field.modelfields import PhoneNumberField  
from trucks.models import Truck
# Carrier (Trucking Company)
class Carrier(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    owner = models.OneToOneField("User", on_delete=models.SET_NULL, null=True, related_name="owned_carrier")
    address=models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# User Manager
class MyAccountManager(BaseUserManager):
    def create_carrier(self, email, first_name, last_name, phone, password, carrier_name):
        """Creates a carrier and assigns the first user as owner."""
        carrier = Carrier.objects.create(name=carrier_name)
        user = self.create_user(email, first_name, last_name, phone, password, carrier=carrier, role='Carrier')
        carrier.owner = user
        carrier.save()
        return user
    def create_driver(self, email, first_name, last_name, phone, password, carrier, license_number, truck=None):
        """Creates a driver associated with a carrier and assigns a truck if provided."""
        user = self.create_user(email, first_name, last_name, phone, password, carrier=carrier, role='Driver')
        
        # Create driver profile
        DriverProfile.objects.create(user=user, carrier=carrier, license_number=license_number, truck=truck)
        
         # Send email to the driver with login credentials
        # send_mail(
        #     "Your Driver Account is Ready",
        #     f"Hello {first_name},\n\nYour account has been created.\nLogin details:\nEmail: {email}\nPassword: {password}\n\nPlease change your password after logging in.",
        #     settings.EMAIL_HOST_USER,
        #     [email],
        #     fail_silently=False,
        # )
        
        return user

    def create_user(self, email, first_name, last_name, phone, password=None, carrier=None, role='Driver'):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            carrier=carrier,
            role=role
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, phone, password):
        user = self.create_user(email, first_name, last_name, phone, password, role='Admin')
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user



# User Model
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('Carrier', 'Carrier Owner'),
        ('Dispatcher', 'Dispatcher'),
        ('Driver', 'Driver'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = PhoneNumberField(unique=True)  # Allow global phone numbers
    carrier = models.ForeignKey(Carrier, on_delete=models.SET_NULL, null=True, blank=True, related_name="staff")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Driver')

    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone']

    objects = MyAccountManager()
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name
  
    def __str__(self):
        return self.email


class DriverProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="driver")
    carrier = models.ForeignKey("users.Carrier", on_delete=models.CASCADE, related_name="drivers") 
    truck = models.OneToOneField("trucks.Truck", on_delete=models.SET_NULL, null=True, blank=True, related_name="driver")  
    license_number = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.license_number}"