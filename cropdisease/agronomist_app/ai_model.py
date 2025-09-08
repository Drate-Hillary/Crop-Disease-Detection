import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
from PIL import Image

class CropDiseasePredictor:
    def __init__(self):
        self.model = None
        self.classes = ['healthy', 'diseased']
        
    def create_model(self, input_shape=(224, 224, 3), num_classes=2):
        """Create a simple CNN model for crop disease prediction"""
        model = models.Sequential([
            layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
            layers.MaxPooling2D((2, 2)),
            layers.Conv2D(64, (3, 3), activation='relu'),
            layers.MaxPooling2D((2, 2)),
            layers.Conv2D(64, (3, 3), activation='relu'),
            layers.Flatten(),
            layers.Dense(64, activation='relu'),
            layers.Dense(num_classes, activation='softmax')
        ])
        
        model.compile(optimizer='adam',
                     loss='categorical_crossentropy',
                     metrics=['accuracy'])
        
        self.model = model
        return model
    
    def preprocess_image(self, image_path):
        """Preprocess image for prediction"""
        img = Image.open(image_path)
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    
    def predict(self, image_path):
        """Make prediction on a single image"""
        if self.model is None:
            raise ValueError("Model not loaded")
            
        processed_image = self.preprocess_image(image_path)
        prediction = self.model.predict(processed_image)
        
        predicted_class = np.argmax(prediction[0])
        confidence = float(prediction[0][predicted_class])
        
        return {
            'disease': self.classes[predicted_class],
            'confidence': confidence * 100
        }
    
    def save_model(self, filepath):
        """Save the trained model"""
        if self.model:
            self.model.save(filepath)
    
    def load_model(self, filepath):
        """Load a pre-trained model"""
        self.model = tf.keras.models.load_model(filepath)