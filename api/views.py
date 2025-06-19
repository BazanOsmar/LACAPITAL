from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import HamburguesaSerializer
from hamburger.models import Hamburguesa


@api_view(['GET'])
def listar_hamburguesas(request):
    hamburguesas = Hamburguesa.objects.all()
    serializer = HamburguesaSerializer(hamburguesas, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_hamburguesa(request):
    serializer = HamburguesaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print("Errores de validación:", serializer.errors)  # <-- añade esto
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def actualizar_hamburguesa(request, pk):
    try:
        hamburguesa = Hamburguesa.objects.get(pk=pk)
    except Hamburguesa.DoesNotExist:
        return Response({'error': 'Hamburguesa no encontrada'}, status=404)

    serializer = HamburguesaSerializer(hamburguesa, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
def eliminar_hamburguesa(request, pk):
    try:
        hamburguesa = Hamburguesa.objects.get(pk=pk)
    except Hamburguesa.DoesNotExist:
        return Response({'error': 'Hamburguesa no encontrada'}, status=404)

    hamburguesa.delete()
    return Response({'mensaje': 'Hamburguesa eliminada correctamente'}, status=204)


