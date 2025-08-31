from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from .forms import UserRegistrationForm, ProfileUpdateForm
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.core.files.storage import FileSystemStorage
import os
from .forms import AdminUserCreationForm


# view for farmer signing up
def signUp(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        
        if form.is_valid():
            user = form.save(commit=False)
            
            user.terms_accepted = form.cleaned_data['agree_terms']
            user.is_newsletter_subscribed = form.cleaned_data['newsletter']
            
            user.save()
            
            login(request, user, backend='authentication.backends.EmailBackend')
            messages.success(request, 'Account created successfully!')
            return redirect('farmer_home')

        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        form = UserRegistrationForm()
    
    return render(request, 'signInSignUp/sign_up.html')



# Only allow access to admin users
def is_admin(user):
    return user.is_superuser

# Administrator to add a user
@login_required
@user_passes_test(is_admin)
def admin_add_user(request):
    if request.method == 'POST':
        form = AdminUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, f'User {user.user_name} created successfully!')
            return redirect('admin_home')  
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request,f'{field}: {error}')
    return redirect('admin_home')



def signIn(request):
    print(f"DEBUG: SignIn view called - Method: {request.method}")
    print(f"DEBUG: User authenticated: {request.user.is_authenticated}")

    if request.user.is_authenticated:
        if request.user.is_superuser:
            print("DEBUG: User already authenticated, redirecting to admin dashboard")
            return redirect('admin_home')
        elif request.user.role == 'farmer':
            print("DEBUG: User already authenticated, redirecting to farmer_home")
            return redirect('farmer_home')
        elif request.user.role == 'agronomist':
            print("DEBUG: User already authenticated, redirecting to expert_home")
            return redirect('agronomist_home')
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        print(f"DEBUG: Login attempt - Email: {email}")
        
        user = authenticate(request, email=email, password=password)
        print(f"DEBUG: Authenticate result: {user}")
        
        if user is not None:
            login(request, user)
            if user.is_superuser:
                print("DEBUG: Login successful, redirecting to admin dashboard")
                return redirect('admin_home')
            elif user.role == 'agronomist':
                print("DEBUG: Login successful, redirecting to agronomist_home")
                return redirect('agronomist_home')
            elif user.role == 'farmer':
                print("DEBUG: Login successful, redirecting to farmer_home")
                messages.success(request, 'Successfully logged in!')
                return redirect('farmer_home') 
            
        else:
            print("DEBUG: Authentication failed")
            messages.error(request, 'Invalid email or password.')
            return redirect('sign_in')
        
    return render(request, 'signInSignUp/sign_in.html')


# view for signing out
@login_required
def sign_out(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('sign_in')


# view for editing profile
@login_required
def edit_profile(request):
    if request.method == 'POST':
        form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user)
        
        if form.is_valid():
            # Handle profile image upload
            if 'profile_image' in request.FILES:
                # Delete old profile image if it exists
                if request.user.profile_image and request.user.profile_image.name != 'default_profile.png':
                    old_image_path = request.user.profile_image.path
                    if os.path.exists(old_image_path):
                        os.remove(old_image_path)
                
                # Save new profile image
                profile_image = request.FILES['profile_image']
                fs = FileSystemStorage()
                filename = fs.save(f'profile_images/user_{request.user.id}_{profile_image.name}', profile_image)
                form.instance.profile_image = filename
            
            # Save the updated user information
            form.save()
            
            # Check if password is being changed
            password_form = PasswordChangeForm(request.user, request.POST)
            if password_form.is_valid():
                user = password_form.save()
                update_session_auth_hash(request, user)  # Important to keep user logged in
                messages.success(request, 'Your password was successfully updated!')
            
            messages.success(request, 'Your profile has been updated successfully!')
            return redirect('farmer_home')  # Redirect to profile page
            
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = ProfileUpdateForm(instance=request.user)
    
    return render(request, 'farmer_app/farmer_home.html')