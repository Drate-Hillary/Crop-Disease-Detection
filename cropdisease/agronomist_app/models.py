from django.db import models
from authentication.models import User

class CropDisease(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    AREA_AFFECTED_CHOICES = [
        ('leaves', 'Leaves'),
        ('stems', 'Stems'),
        ('fruits', 'Fruits'),
    ]
    
    SOLUTION_CHOICES = [
        ('cultural_control', 'Cultural and Preventive Practices'),
        ('chemical_control', 'Chemical Control'),
    ]
    
    agronomist = models.ForeignKey(User, on_delete=models.CASCADE)
    disease_name = models.CharField(max_length=200)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='low')
    area_affected = models.CharField(max_length=10, choices=AREA_AFFECTED_CHOICES, default='leaves')
    symptoms = models.TextField()
    solution_type = models.CharField(max_length=20, choices=SOLUTION_CHOICES, default='cultural_control')
    solution = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.disease_name} - {self.priority}"

class HealthyCrop(models.Model):
    agronomist = models.ForeignKey(User, on_delete=models.CASCADE)
    crop_name = models.CharField(max_length=200)
    characteristics = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.crop_name

class HealthyCropImage(models.Model):
    crop = models.ForeignKey(HealthyCrop, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='healthy_crop_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.crop.crop_name}"

class CropDiseaseImage(models.Model):
    report = models.ForeignKey(CropDisease, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='crop_disease_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.report.disease_name}"

class AIModel(models.Model):
    MODEL_TYPES = [
        ('cnn', 'CNN'),
        ('resnet', 'ResNet'),
        ('vgg', 'VGG'),
    ]
    
    STATUS_CHOICES = [
        ('training', 'Training'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    name = models.CharField(max_length=200)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPES)
    crop_type = models.CharField(max_length=100)
    accuracy = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='training')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Prediction(models.Model):
    model = models.ForeignKey(AIModel, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='predictions/')
    predicted_disease = models.CharField(max_length=200)
    confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.predicted_disease} - {self.confidence}%"