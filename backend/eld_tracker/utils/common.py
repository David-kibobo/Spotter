from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound

def get_object_or_error(model, **kwargs):
    """
    Get an object or raise a 404 error with a custom message.
    """
    try:
        return get_object_or_404(model, **kwargs)
    except NotFound:
        raise NotFound({  # ✅ DRF will convert this to a 404 response
            "error": f"{model.__name__} not found with the given criteria."
        })
