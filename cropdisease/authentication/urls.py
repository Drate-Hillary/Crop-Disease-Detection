from django.urls import path
from .views import signIn, signUp

urlpatterns = [
    path('sign-in/', signIn, name='sign_in'),
    path('sign-up/', signUp, name='sign_up'), 
]