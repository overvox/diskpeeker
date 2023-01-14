"""diskpeeker_project URL Configuration"""

from django.contrib import admin
from django.urls import path, include
from diskpeeker.views import DiskViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'diskinfo', DiskViewSet, basename='diskinfo')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
]
