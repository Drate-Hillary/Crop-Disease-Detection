from django.urls import path, include

from .views import agronomist_home

urlpatterns = [
    path('', agronomist_home, name='agronomist_home'),
]