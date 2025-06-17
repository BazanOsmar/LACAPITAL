from rest_framework import serializers
from hamburger.models import Hamburguesa

class HamburguesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hamburguesa
        fields = '__all__'

    def validate_nombre(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("El nombre no puede estar vacío o solo espacios.")
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("El nombre no debe contener números.")

        if self.instance is None:
            if Hamburguesa.objects.filter(nombre__iexact=value).exists():
                raise serializers.ValidationError("Ya existe una hamburguesa con ese nombre.")
        else:
            if Hamburguesa.objects.filter(nombre__iexact=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Ya existe otra hamburguesa con ese nombre.")
        
        return value


    def validate_descripcion(self, value):
        if not value.strip():
            raise serializers.ValidationError("La descripción no puede estar vacía.")
        if len(value.strip()) < 10:
            raise serializers.ValidationError("La descripción debe tener al menos 10 caracteres.")
        return value

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor que cero.")
        return value

    def validate_modelo3d(self, value):
        if not value.startswith("https"):
            raise serializers.ValidationError("El modelo3d debe ser una URL válida.")
        return value
    
    def validate_imagen(self, value):
        if not value.startswith("https"):
            raise serializers.ValidationError("La imagen debe ser una URL válida.")
        return value

    def validate_textura_modelo(self, value):
        if not value.startswith("https"):
            raise serializers.ValidationError("La textura del modelo debe ser una URL válida.")
        return value

    def validate(self, data):
        if data['tamaño_ancho'] <= 0 or data['tamaño_alto'] <= 0:
            raise serializers.ValidationError("Las dimensiones deben ser mayores que cero.")
        return data
