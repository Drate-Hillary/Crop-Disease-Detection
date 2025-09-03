from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from authentication.models import User
from django.utils import timezone
from datetime import timedelta

@login_required
def admin_home(request):
    users = User.objects.filter(is_superuser=False)
    
    # Apply filters
    role_filter = request.GET.get('role')
    status_filter = request.GET.get('status')
    
    if role_filter:
        users = users.filter(role=role_filter)
    
    if status_filter == 'active':
        users = users.filter(is_active=True)
    elif status_filter == 'inactive':
        users = users.filter(is_active=False)
    
    # Calculate user growth percentage
    today = timezone.now()
    last_week = today - timedelta(days=7)
    
    current_users = users.count()
    last_week_users = User.objects.filter(is_superuser=False, date_joined__lt=last_week).count()
    
    if last_week_users > 0:
        user_growth = round(((current_users - last_week_users) / last_week_users) * 100, 1)
    else:
        user_growth = 100 if current_users > 0 else 0

    
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active
        user.save()

    context = {
        'users': users,
        'user_growth': user_growth,
    }

    return render(request, 'administrator_page.html', context)
