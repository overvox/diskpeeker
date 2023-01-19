from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework import status

from .models import DiskInfo, DiskUsage
from .serializers import *
from .services import DiskService

class DiskViewSet(viewsets.ViewSet):
    """API Endpoints for disk information"""

    queryset = DiskInfo.objects.all()
    serializer_class = DiskInfoSerializer

    @action(detail=False, methods=['post'])
    def init(self, request):
        if DiskService.init_disks():
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request):
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        diskinfo = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(diskinfo, many=False)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        diskinfo = get_object_or_404(self.queryset, pk=pk)
        serializer = self.serializer_class(diskinfo, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'status': 'disk info updated'})

    @action(detail=False, methods=['get'])
    def retrieve_usage(self, request):
        usages = DiskService.get_nonhidden_disk_usages()
        serializer = DiskUsageSerializer(usages, many=True)
        return Response(data=serializer.data)