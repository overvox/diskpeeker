from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import DiskInfo, DiskUsage, FullDiskInfo

class DiskInfoListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        diskinfo_mapping = {disk.id: disk for disk in instance}
        data_mapping = {disk_item['id']: disk_item for disk_item in validated_data}

        # Perform updates and ignore creation & deletion
        ret = []
        for disk_id, data in data_mapping.items():
            disk = diskinfo_mapping.get(disk_id, None)
            if disk is not None:
                ret.append(self.child.update(disk, data))

        return ret

class DiskInfoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = DiskInfo 
        fields = ('id', 'device', 'name', 'hidden')
        required = ('id')
        read_only_fields = ('device',)
        list_serializer_class = DiskInfoListSerializer

class FullDiskInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FullDiskInfo 
        fields = ('device', 'name', 'type', 'total', 'used', 'hidden')
        read_only_fields = ('device',)

class DiskUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiskUsage 
        fields = ('device', 'type', 'total', 'used')
