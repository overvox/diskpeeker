from rest_framework import serializers
from .models import DiskInfo, DiskUsage

class DiskInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiskInfo 
        fields = ('id', 'device', 'name', 'hidden')

class DiskUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiskUsage 
        fields = ('device', 'type', 'total', 'used', 'free')