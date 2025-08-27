from django.urls import path
from .views import signIn, signUp, edit_profile

urlpatterns = [
    path('sign-in/', signIn, name='sign_in'),
    path('sign-up/', signUp, name='sign_up'), 
    path('edit-profile/', edit_profile, name='edit_profile'),
]