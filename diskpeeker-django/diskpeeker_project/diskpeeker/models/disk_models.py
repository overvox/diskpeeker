from django.db import models

class DiskInfo(models.Model):
    device = models.CharField("Device", max_length=240)
    name: str= models.CharField("Name", max_length=240)
    hidden = models.BooleanField("Hidden")

    def __str__(self):
        return self.name

class FullDiskInfo(models.Model):
    device = models.CharField("Device", max_length=240)
    name: str= models.CharField("Name", max_length=240)
    "human readable disk name"
    type: str = models.CharField("Type", max_length=240)
    "disk file system type"
    total: int = models.IntegerField("Total")
    "total disk size in bytes"
    used: int = models.IntegerField("Used")
    "used disk size in bytes"
    hidden = models.BooleanField("Hidden")

    def __str__(self):
        return self.name

class DiskUsage(models.Model):
    device = models.CharField("Device", max_length=240)
    type: str = models.CharField("Type", max_length=240)
    "disk file system type"
    total: int = models.IntegerField("Total")
    "total disk size in bytes"
    used: int = models.IntegerField("Used")
    "used disk size in bytes"

    def __str__(self):
        return self.device