from django.urls import path

from .views import admin_home
from authentication.views import admin_add_user, sign_out

urlpatterns = [
    path('', admin_home, name='admin_home'),
    path('sign-out/', sign_out, name='sign_out'),
    path('add-user/', admin_add_user, name='admin_add_user'),
    # path('user-list/', user_list, name='user_list'),
]