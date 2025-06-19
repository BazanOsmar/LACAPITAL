from django.urls import path
from .views import login_view, panel_view, logout_view, formulario_hamburguesa_view

urlpatterns = [
    path('login/', login_view, name='management_login'),
    path('panel/', panel_view, name='panel'),
    path('logout/', logout_view, name='logout'),
    path('formulario/', formulario_hamburguesa_view, name='formulario_hamburguesa'),
]