from rest_framework.response import Response
from rest_framework import status

def success_response(message, data=None, status_code=status.HTTP_200_OK):
    """
    Standard success response format.
    """
    return Response({"message": message, "data": data}, status=status_code)

def error_response(message, code=None):
    """
    Standard error response format.
    Accepts optional status code (e.g. 403, 404, etc.)
    """
    status_code = code or status.HTTP_400_BAD_REQUEST
    return Response({"error": message}, status=status_code)