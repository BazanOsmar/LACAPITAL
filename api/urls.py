from django.urls import path
from .views import (
    crear_hamburguesa,
    listar_hamburguesas,
    actualizar_hamburguesa,
    eliminar_hamburguesa
)

urlpatterns = [
    path('hamburguesas/', crear_hamburguesa, name='crear_hamburguesa'),
    path('hamburguesas/listar/', listar_hamburguesas, name='listar_hamburguesas'),
    path('hamburguesas/<int:pk>/actualizar/', actualizar_hamburguesa, name='actualizar_hamburguesa'),
    path('hamburguesas/<int:pk>/eliminar/', eliminar_hamburguesa, name='eliminar_hamburguesa'),
]
