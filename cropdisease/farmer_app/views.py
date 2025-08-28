from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Create your views here.

@login_required
def farmer_home(request):
    return render(request, 'farmer_home.html')