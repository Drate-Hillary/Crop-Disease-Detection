from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from authentication.models import User
from django.utils import timezone
from datetime import timedelta
from agronomist_app.models import CropDisease, CropDiseaseImage

def format_time_ago(time_diff):
    total_seconds = int(time_diff.total_seconds())
    if total_seconds < 60:
        return f"{total_seconds} sec ago"
    elif total_seconds < 3600:
        mins = total_seconds // 60
        return f"{mins} mins ago"
    elif total_seconds < 86400:
        hours = total_seconds // 3600
        return f"{hours} hrs ago"
    else:
        days = total_seconds // 86400
        return f"{days} days ago"

def calculate_growth_stats():
    today = timezone.now()
    last_week = today - timedelta(days=7)
    yesterday = today - timedelta(days=1)
    
    current_users = User.objects.filter(is_superuser=False).count()
    last_week_users = User.objects.filter(is_superuser=False, date_joined__lt=last_week).count()
    
    user_growth = round(((current_users - last_week_users) / last_week_users) * 100, 1) if last_week_users > 0 else (100 if current_users > 0 else 0)
    
    current_images = CropDiseaseImage.objects.count()
    yesterday_images = CropDiseaseImage.objects.filter(uploaded_at__lt=yesterday).count()
    
    image_growth = round(((current_images - yesterday_images) / yesterday_images) * 100, 1) if yesterday_images > 0 else (100 if current_images > 0 else 0)
    
    return user_growth, image_growth

def get_time_since_last_activities():
    last_image = CropDiseaseImage.objects.order_by('-uploaded_at').first()
    last_user = User.objects.filter(is_superuser=False).order_by('-date_joined').first()
    
    time_since = "never"
    user_time_since = "never"
    
    if last_image:
        time_diff = timezone.now() - last_image.uploaded_at
        total_seconds = int(time_diff.total_seconds())
        if total_seconds < 60:
            time_since = f"{total_seconds}sec"
        elif total_seconds < 3600:
            time_since = f"{total_seconds // 60}mins"
        elif total_seconds < 86400:
            time_since = f"{total_seconds // 3600}hrs"
        else:
            time_since = f"{total_seconds // 86400}days"
    
    if last_user:
        time_diff = timezone.now() - last_user.date_joined
        user_time_since = format_time_ago(time_diff)
    
    return time_since, user_time_since, last_image.uploaded_at if last_image else None

def get_recent_activities():
    recent_users = User.objects.order_by('-date_joined')[:5]
    recent_reports = CropDisease.objects.select_related('agronomist').order_by('-created_at')[:5]
    
    activities = []
    
    for user in recent_users:
        time_ago = format_time_ago(timezone.now() - user.date_joined)
        user_type = "Admin" if user.is_superuser else "User"
        activities.append({
            'type': 'user',
            'message': f"New {user_type.lower()} registered",
            'user': user.user_name,
            'time': time_ago,
            'timestamp': user.date_joined
        })
    
    for report in recent_reports:
        time_ago = format_time_ago(timezone.now() - report.created_at)
        activities.append({
            'type': 'report',
            'message': f"{report.disease_name} report",
            'user': report.agronomist.user_name,
            'time': time_ago,
            'timestamp': report.created_at
        })
    
    return sorted(activities, key=lambda x: x['timestamp'], reverse=True)[:5]

@login_required
def admin_home(request):
    users = User.objects.filter(is_superuser=False)
    total_images = CropDiseaseImage.objects.count()
    
    # Apply filters
    role_filter = request.GET.get('role')
    status_filter = request.GET.get('status')
    
    if role_filter:
        users = users.filter(role=role_filter)
    
    if status_filter == 'active':
        users = users.filter(is_active=True)
    elif status_filter == 'inactive':
        users = users.filter(is_active=False)
    
    user_growth, image_growth = calculate_growth_stats()
    time_since, user_time_since, last_upload_time = get_time_since_last_activities()
    activities = get_recent_activities()
    
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active
        user.save()

    context = {
        'users': users,
        'user_growth': user_growth,
        'total_images': total_images,
        'image_growth': image_growth,
        'last_upload_time': last_upload_time,
        'time_since': time_since,
        'user_time_since': user_time_since,
        'activities': activities,
    }

    return render(request, 'administrator_page.html', context)
