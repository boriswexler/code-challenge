from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User, Group
from models import Portfolio, Position, Transaction
from rest_framework import viewsets
from rest_framework_extensions.mixins import NestedViewSetMixin
from serializers import UserSerializer, GroupSerializer, PortfolioSerializer, PositionSerializer, TransactionSerializer
import requests


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
   
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class PortfolioViewSet(viewsets.ModelViewSet):
    
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer


class PositionViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

class TransactionViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    ordering = Transaction._meta.ordering



def getQuote(self, *args, **kwargs):
	symbol =  kwargs['symbol']
	return HttpResponse(requests.get("http://careers-data.benzinga.com/rest/richquote?symbols=" + symbol).content)