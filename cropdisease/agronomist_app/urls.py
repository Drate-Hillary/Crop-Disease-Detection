from django.urls import path, include

from .views import agronomist_home
from authentication.views import sign_out

urlpatterns = [
    path('', agronomist_home, name='agronomist_home'),
    path('sign_out/', sign_out, name='sign_out'),
]