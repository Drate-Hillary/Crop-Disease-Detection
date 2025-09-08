from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
import os
from .models import CropDisease, CropDiseaseImage, HealthyCrop, HealthyCropImage, AIModel, Prediction
from .ai_model import CropDiseasePredictor
from django.db.models import Count



# Create your views here.
@login_required
def agronomist_home(request):

    total_images = CropDiseaseImage.objects.count() + HealthyCropImage.objects.count()
    diseases_with_counts = CropDisease.objects.annotate(image_count=Count('images')).values('disease_name', 'image_count')
    healthy_crops_with_counts = HealthyCrop.objects.annotate(image_count=Count('images')).values('crop_name', 'image_count')

    context = {
        'total_images': total_images,
        'diseases_with_counts': diseases_with_counts,
        'healthy_crops_with_counts': healthy_crops_with_counts,
    }
    
    return render(request, 'agronomist_page.html', context)


@login_required
def save_crop_data(request):
    if request.method == 'POST':
        category = request.POST.get('category')
        
        if category == 'healthy':
            # Save healthy crop
            crop_name = request.POST.get('crop_name') or 'Healthy Crop'
            characteristics = request.POST.get('characteristics') or 'No characteristics provided'
            
            crop = HealthyCrop.objects.create(
                agronomist=request.user,
                crop_name=crop_name,
                characteristics=characteristics
            )
            
            images = request.FILES.getlist('images')
            for image in images:
                HealthyCropImage.objects.create(
                    crop=crop,
                    image=image
                )
            
            messages.success(request, f'Healthy crop "{crop_name}" saved successfully!')
            
        else:
            # Save diseased crop
            disease_name = request.POST.get('disease_name')
            priority = request.POST.get('priority', 'low')
            area_affected = request.POST.get('area_affected', 'leaves')
            symptoms = request.POST.get('symptoms')
            solution_type = request.POST.get('solutions', 'cultural_control')
            
            report = CropDisease.objects.create(
                agronomist=request.user,
                disease_name=disease_name,
                priority=priority,
                area_affected=area_affected,
                symptoms=symptoms,
                solution_type=solution_type,
            )
            
            images = request.FILES.getlist('images')
            for image in images:
                CropDiseaseImage.objects.create(
                    report=report,
                    image=image
                )
            
            messages.success(request, f'Crop disease report "{disease_name}" saved successfully!')
    
    return redirect('agronomist_home')

@login_required
def predict_disease(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']
        
        # Save uploaded image temporarily
        temp_path = f'temp_{image.name}'
        with open(temp_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        
        # Make prediction
        predictor = CropDiseasePredictor()
        try:
            # Load pre-trained model (you need to train and save it first)
            predictor.load_model('crop_disease_model.h5')
            result = predictor.predict(temp_path)
            
            # Save prediction to database
            model = AIModel.objects.first()  # Get first available model
            if model:
                Prediction.objects.create(
                    model=model,
                    image=image,
                    predicted_disease=result['disease'],
                    confidence=result['confidence']
                )
            
            # Clean up temp file
            os.remove(temp_path)
            
            return JsonResponse({
                'success': True,
                'disease': result['disease'],
                'confidence': result['confidence']
            })
            
        except Exception as e:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'No image provided'})

