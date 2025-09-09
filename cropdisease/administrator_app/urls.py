from django.urls import path

from .views import admin_home, predict_disease
from authentication.views import admin_add_user, sign_out

urlpatterns = [
    path('', admin_home, name='admin_home'),
    path('sign-out/', sign_out, name='sign_out'),
    path('add-user/', admin_add_user, name='admin_add_user'),
    path('predict-disease/', predict_disease, name='predict_disease'),
]