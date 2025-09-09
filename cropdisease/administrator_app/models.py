from django.db import models

# Creating an AI prediction Model
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