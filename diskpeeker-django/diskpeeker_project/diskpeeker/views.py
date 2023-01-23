from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework import status

from .models import DiskInfo, DiskUsage, FullDiskInfo
from .serializers import *
from .services import DiskService

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

    @action(detail=False, methods=['GET'])
    def usage(self, request):
        usages = DiskService.get_disk_usages()
        serializer = DiskUsageSerializer(usages, many=True)
        return Response(data=serializer.data)

    @action(detail=False, methods=['GET'])
    def full(self, request):
        allDisks = DiskInfo.objects.all()
        usages = DiskService.get_disk_usages()

        fullDiskInfos = [] 

        for disk in allDisks:
            usage: DiskUsage = next(filter(lambda usage: disk.device == usage.device, usages))
            
            if usage:
                fullDiskInfos.append(FullDiskInfo(name=disk.name, device=disk.device, hidden=disk.hidden, type=usage.type, total=usage.total, used=usage.used))
            else:
                fullDiskInfos.append(FullDiskInfo(name=disk.name, device=disk.device, hidden=disk.hidden, type="Unknown", total=0, used=0))

        serializer = FullDiskInfoSerializer(fullDiskInfos, many=True)
        return Response(data=serializer.data)