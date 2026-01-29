from django.shortcuts import render
from django.http import HttpResponse 
from .models import todo
from .serializers import TodoSerializer
from rest_framework import viewsets
# Create your views here.

def home(request) : 
    return HttpResponse("Welcome to MyApp Home Page!") 

class TodoViewSet(viewsets.ModelViewSet):
    queryset = todo.objects.all()
    serializer_class = TodoSerializer