from django.urls import path
from .views import farmer_home

urlpatterns = [
    path('', farmer_home, name='farmer_home'),
]