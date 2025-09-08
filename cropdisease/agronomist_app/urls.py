from django.urls import path

from .views import agronomist_home, save_crop_data, predict_disease
from authentication.views import sign_out, edit_profile

urlpatterns = [
    path('', agronomist_home, name='agronomist_home'),
    path('sign_out/', sign_out, name='sign_out'),
    path('editProfile', edit_profile, name='edit_profile'),
    path('save-crop/', save_crop_data, name='save_crop_data'),
    path('predict/', predict_disease, name='predict_disease'),
]