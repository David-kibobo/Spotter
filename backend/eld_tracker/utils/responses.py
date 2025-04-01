from rest_framework.response import Response
from rest_framework import status

def success_response(message, data=None, status_code=status.HTTP_200_OK):
    """
    Standard success response format.
    """
    return Response({"message": message, "data": data}, status=status_code)

def error_response(message, status_code=status.HTTP_400_BAD_REQUEST):
    """
    Standard error response format.
    """
    return Response({"error": message}, status=status_code)
