from django.contrib.auth.backends import ModelBackend
from .models import Farmer

class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = Farmer.objects.get(email=email)
            if user.check_password(password):
                return user
        except Farmer.DoesNotExist:
            return None
        return None
    
    def get_user(self, user_id):
        try:
            return Farmer.objects.get(pk=user_id)
        except Farmer.DoesNotExist:
            return None