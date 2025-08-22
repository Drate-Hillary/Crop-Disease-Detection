from django.shortcuts import render

# Create your views here.
def agronomist_home(request):
    return render(request, 'agronomist_page.html')