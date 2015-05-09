from django.contrib.auth.models import User, Group
from models import Portfolio, Position, Transaction
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ('id', 'name', 'balance', 'updated_at', 'created_at', 'positions', 'transactions')


class PositionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Position
		#fields = ('portfolio_id', 'symbol', 'average_cost', 'num_shares')

class TransactionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Transaction