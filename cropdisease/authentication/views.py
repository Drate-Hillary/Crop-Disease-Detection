from django.shortcuts import render

# Create your views here.

def signIn(request):
    return render(request, 'signInSignUp/sign_in.html')

def signUp(request):
    return render(request, 'signInSignUp/sign_up.html')