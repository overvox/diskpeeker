from rest_framework import serializers
from .models import DiskInfo, DiskUsage, FullDiskInfo

class DiskInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiskInfo 
        fields = ('id', 'device', 'name', 'hidden')

class FullDiskInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FullDiskInfo 
        fields = ('device', 'name', 'type', 'total', 'used', 'hidden')

class DiskUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiskUsage 
        fields = ('device', 'type', 'total', 'used')