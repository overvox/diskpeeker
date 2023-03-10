from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework import status

from .models.disk_models import DiskInfo, DiskUsage, FullDiskInfo
from .models.serializers import *
from .services.disk_service import DiskService

class DiskViewSet(viewsets.ViewSet):
    """API Endpoints for disk information"""

    serializer_class = DiskInfoSerializer

    @action(detail=False, methods=['POST'])
    def init(self, request):
        if DiskService.init_disks():
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request):
        queryset = DiskInfo.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = DiskInfo.objects.all()
        diskinfo = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(diskinfo, many=False)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        queryset = DiskInfo.objects.all()
        diskinfo = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(diskinfo, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'status': 'disk info updated'})

    def put(self, request):
        serialized = self.serializer_class(data=request.data, many=isinstance(request.data, list))
        serialized.is_valid(raise_exception=True)

        diskInstance = str()
        valid_data = serialized.validated_data

        if isinstance(request.data, list):
            ids = {disk_item['id'] for disk_item in valid_data}
            diskInstance =  DiskInfo.objects.filter(pk__in=ids)
        else:
            diskInstance =  DiskInfo.objects.filter(id=serialized.validated_data['id']).first()
            
        serialized.update(diskInstance, valid_data)

        return Response({'status': 'updated'})

    @action(detail=False, methods=['GET'])
    def usage(self, request):
        usages = DiskService.get_disk_usages()
        serializer = DiskUsageSerializer(usages, many=True)
        return Response(data=serializer.data)

    @action(detail=False, methods=['GET'])
    def full(self, request):
        full_disk_infos = DiskService.get_full_disk_info(list(DiskInfo.objects.all()))

        serializer = FullDiskInfoSerializer(full_disk_infos, many=True)
        return Response(data=serializer.data)