import psutil
from psutil._common import sdiskpart
from diskpeeker.models.disk_models import DiskInfo, DiskUsage, FullDiskInfo

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
    def get_disk_usages(get_visible_only: bool = False) -> list[DiskUsage]:
        """gets current disk usage for all or visible only disks."""
        disk_partitions: list[sdiskpart]

        try:
            disk_partitions = psutil.disk_partitions()
        except:
            disk_partitions = []

        diskinfos: list[DiskInfo] = []

        # return empty list in case psutil was not able to fetch disk info from system
        if not disk_partitions or len(disk_partitions) == 0:
            return [DiskUsage]

        if get_visible_only:
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
    
    @staticmethod
    def get_full_disk_info(all_disks: list[DiskInfo]) -> list[FullDiskInfo]:
        usages: list[DiskUsage] = DiskService.get_disk_usages()

        full_disk_infos: list[FullDiskInfo] = []
        
        for disk in all_disks:
            usage: DiskUsage = next(filter(lambda usage: disk.device == usage.device, usages), None)
            
            if usage:
                full_disk_infos.append(FullDiskInfo(name=disk.name, device=disk.device, hidden=disk.hidden, type=usage.type, total=usage.total, used=usage.used))
            else:
                full_disk_infos.append(FullDiskInfo(name=disk.name, device=disk.device, hidden=disk.hidden, type="Unknown", total=0, used=0))

        return full_disk_infos