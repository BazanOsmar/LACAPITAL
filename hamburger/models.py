from django.db import models

class Hamburguesa(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=250)
    modelo3d = models.URLField(max_length=1000)
    imagen = models.URLField(max_length=1000)
    textura_modelo = models.URLField(max_length=1000)  
    tamaño_alto = models.DecimalField(max_digits=3, decimal_places=1)
    tamaño_ancho = models.DecimalField(max_digits=3, decimal_places=1)
    precio = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'Hamburguesa'
