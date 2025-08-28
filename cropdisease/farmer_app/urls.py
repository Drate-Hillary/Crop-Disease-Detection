from django.urls import path
from .views import farmer_home
from authentication.views import sign_out

urlpatterns = [
    path('', farmer_home, name='farmer_home'),
    path('sign-out/', sign_out, name='sign_out'),
]