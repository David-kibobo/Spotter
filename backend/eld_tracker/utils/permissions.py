from rest_framework.permissions import BasePermission

class IsCarrier(BasePermission):
    """
    Allows access only to Carrier or Dispatcher users.
    """
    message = "Only carriers or dispatchers can perform this operation."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['Carrier', 'Dispatcher']


class IsDriver(BasePermission):
    """
    Allows access only to Driver users.
    """
    message = "Only drivers can perform this operation."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'Driver'
