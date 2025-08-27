from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, authenticate
from .forms import FarmerRegistrationForm, ProfileUpdateForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.core.files.storage import FileSystemStorage
import os

def signUp(request):
    if request.method == 'POST':
        form = FarmerRegistrationForm(request.POST)
        
        if form.is_valid():
            # Create user but don't save yet
            user = form.save(commit=False)
            
            # Set additional fields
            user.terms_accepted = form.cleaned_data['agree_terms']
            user.is_newsletter_subscribed = form.cleaned_data['newsletter']
            
            # Save the user
            user.save()
            
            # Authenticate and login the user
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')
            user = authenticate(request, email=email, password=password)
            
            if user is not None:
                login(request, user)
                messages.success(request, 'Account created successfully! Welcome to our platform.')
                return redirect('farmer_app/farmer_home.html')  # Redirect to farmer dashboard

        else:
            # Add form errors to messages
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        form = FarmerRegistrationForm()
    
    return render(request, 'signInSignUp/sign_up.html')

def signIn(request):
    # Your existing sign in view
    return render(request, 'signInSignUp/sign_up.html')

# profile update view
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