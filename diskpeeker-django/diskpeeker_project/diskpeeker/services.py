import logging
import psutil

from .models import DiskInfo, DiskUsage

class DiskService:
    """Service handling the fetching of disk related hardware data."""

    @staticmethod
    def init_disks() -> bool:
        """Initializes and saves currently mounted disks in the os to the database. Returns False if fetching disk partitions failed."""
        disk_partitions = psutil.disk_partitions()

        if disk_partitions is None:
            return False

        for partition in disk_partitions:
            if DiskInfo.objects.filter(name = partition.device).exists():
                pass # do nothing for now, maybe update or something
                return True
            else:
                diskinfo = DiskInfo(device=partition.device, name=partition.device, hidden=False)
                diskinfo.save()
                return True

    @staticmethod
    def get_nonhidden_disk_usages() -> list[DiskUsage]:
        """gets current disk usage for all non-hidden disks."""
        disk_partitions = psutil.disk_partitions()
        nonhidden_diskinfos = DiskInfo.objects.filter(hidden = False) 

        nonhidden_disk_partitions = list(filter(lambda partition: any(info.device == partition.device for info in nonhidden_diskinfos), disk_partitions))

        usage_list:DiskUsage = []

        for partition in nonhidden_disk_partitions:
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                usage_list.append(DiskUsage(device=partition.device, type=partition.fstype, total=usage.total, used=usage.used, free=usage.free))
            except:
                usage_list.append(DiskUsage(device=partition.device, type=partition.fstype, total=0, used=0, free=0))
            
        return usage_list