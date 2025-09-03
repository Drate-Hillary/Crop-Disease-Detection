from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator

ROLE_CHOICE = (
    ('farmer', 'Farmer'),
    ('agronomist', 'Agronomist'),
)

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    # Phone number validator
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    
    user_name = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, validators=[phone_regex], blank=True, null=True)
    newsletter = models.BooleanField(default=False)
    terms_accepted = models.BooleanField(default=False)
    terms_accepted_date = models.DateTimeField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_image/', null=True, blank=True, default="profile_pics/default_profile.png")
    role = models.CharField(max_length=20, choices=ROLE_CHOICE, default='farmer')
    experience = models.PositiveIntegerField(blank=True, null=True, verbose_name="Years of Experience")
    bio = models.TextField(blank=True, null=True, verbose_name="Short Bio")
    
    # Django auth fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.user_name
    
    def get_full_name(self):
        return self.user_name
    
    def get_short_name(self):
        return self.user_name
    
    def get_first_initial(self):
        if self.user_name and len(self.user_name) > 0:
            return self.user_name[0].upper()
        elif self.email and len(self.email) > 0:
            return self.email[0].upper()
        return "U"