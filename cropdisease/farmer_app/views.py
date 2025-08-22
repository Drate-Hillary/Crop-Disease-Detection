from django.shortcuts import render

# Create your views here.

def farmer_home(request):
    return render(request, 'farmer_home.html')