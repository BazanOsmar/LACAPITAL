from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout

def login_view(request):
    error = None
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return redirect('panel')
        else:
            error = "Usuario o contraseña incorrectos."
    return render(request, 'login.html', {'error': error})

def logout_view(request):
    logout(request)
    return redirect('management_login')

@login_required(login_url='/management/login/')
def panel_view(request):
    return render(request, 'panel.html')


@login_required(login_url='/management/login/')
def formulario_hamburguesa_view(request):
    return render(request, 'formulario.html')
