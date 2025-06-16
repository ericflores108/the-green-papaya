from rest_framework import serializers
from .models import BookClub


class BookClubSerializer(serializers.ModelSerializer):
    integration_name = serializers.CharField(source='integration.name', read_only=True)
    
    class Meta:
        model = BookClub
        fields = "__all__"
