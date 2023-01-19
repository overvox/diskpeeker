from django.contrib import admin
from .models import DiskInfo

@admin.register(DiskInfo)
class DiskInfoAdmin(admin.ModelAdmin):
    list_display =("device", "name", "hidden")
