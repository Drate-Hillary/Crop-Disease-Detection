from django.urls import path, include

from .views import agronomist_home
from authentication.views import sign_out, edit_profile

urlpatterns = [
    path('', agronomist_home, name='agronomist_home'),
    path('sign_out/', sign_out, name='sign_out'),
    path('editProfile', edit_profile, name='edit_profile'),
]