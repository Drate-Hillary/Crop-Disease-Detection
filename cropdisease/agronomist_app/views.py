from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import CropDisease, CropDiseaseImage
from django.db.models import Count



# Create your views here.
@login_required
def agronomist_home(request):

    total_images = CropDiseaseImage.objects.count()
    diseases_with_counts = CropDisease.objects.annotate(image_count=Count('images')).values('disease_name', 'image_count')

    context = {
        'total_images': total_images,
        'diseases_with_counts': diseases_with_counts,
    }
    
    return render(request, 'agronomist_page.html', context)


@login_required
def save_crop_disease_report(request):
    try:
        if request.method == 'POST':
            disease_name = request.POST.get('disease_name')
            priority = request.POST.get('priority', 'low')
            area_affected = request.POST.get('area_affected', 'leaves')
            symptoms = request.POST.get('symptoms')
            solution_type = request.POST.get('solutions', 'cultural_control')
            
            # Create the report
            report = CropDisease.objects.create(
                agronomist=request.user,
                disease_name=disease_name,
                priority=priority,
                area_affected=area_affected,
                symptoms=symptoms,
                solution_type=solution_type,
            )
            
            # Handle multiple image uploads
            images = request.FILES.getlist('images')
            for image in images:
                CropDiseaseImage.objects.create(
                    report=report,
                    image=image
                )
            
            messages.success(request, f'Crop disease report "{disease_name}" saved successfully!')
            return redirect('agronomist_home')
    except Exception as e:
        messages.error(request, f'Error saving crop disease report: {str(e)}')

    return redirect('agronomist_home')