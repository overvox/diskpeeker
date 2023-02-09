import psutil
from psutil._common import sdiskpart

from diskpeeker.models.serializers import DiskInfo, DiskUsage

class DiskService:
    """Service handling the fetching of disk related hardware data."""

    @staticmethod
    def init_disks() -> bool:
        """Initializes and saves currently mounted disks in the os to the database. Returns False if fetching disk partitions failed."""
        disk_partitions = psutil.disk_partitions()

        if disk_partitions is None:
            return False

        for partition in disk_partitions:
            if DiskInfo.objects.filter(device = partition.device).exists():
                pass # do nothing for now
            else:
                diskinfo = DiskInfo(device=partition.device, name=partition.device, hidden=False)
                diskinfo.save()
            
        return True

    @staticmethod
    def get_disk_usages(getVisibleOnly: bool = False) -> list[DiskUsage]:
        """gets current disk usage for all or visible only disks."""
        disk_partitions: list[sdiskpart] = psutil.disk_partitions()

        diskinfos: list[DiskInfo] = []

        # return empty list in case psutil was not able to fetch disk info from system
        if not disk_partitions:
            return [DiskUsage]

        if getVisibleOnly:
            diskinfos = list(DiskInfo.objects.filter(hidden = False))
        else:
            diskinfos = list(DiskInfo.objects.all())

        disk_partitions = list(filter(lambda partition: any(info.device == partition.device for info in diskinfos), disk_partitions))

        usage_list = []

        for partition in disk_partitions:
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                usage_list.append(DiskUsage(device=partition.device, type=partition.fstype, total=usage.total, used=usage.used))
            except:
                usage_list.append(DiskUsage(device=partition.device, type=partition.fstype, total=0, used=0))
            
        return usage_list