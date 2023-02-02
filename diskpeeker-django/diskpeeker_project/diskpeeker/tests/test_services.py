import unittest
from django.test import TestCase
from unittest.mock import patch
from typing import List
from psutil._common import sdiskpart
from diskpeeker.services.disk_service import DiskService
from diskpeeker.models.disk_models import DiskInfo, DiskUsage

class DiskServiceTestCase(TestCase):

    mock_disk_partitions: List[sdiskpart] = list()

    def mocked_disk_partitions(self) -> List[sdiskpart]:
        return self.mock_disk_partitions 
    
    def setUp(self) -> None:
        DiskInfo.objects.create(device="disk1", name="disk1", hidden=False)
        DiskInfo.objects.create(device="disk2", name="disk2", hidden=False)
        DiskInfo.objects.create(device="disk3", name="disk3", hidden=True)
        DiskInfo.objects.create(device="disk4", name="disk4", hidden=True)

        self.mock_disk_partitions.append(sdiskpart('disk1', 'disk1mnt', 'NTFS', 'rw,fixed', 255, 260))
        self.mock_disk_partitions.append(sdiskpart('disk2', 'disk2mnt', 'NTFS', 'rw,fixed', 255, 260))
        self.mock_disk_partitions.append(sdiskpart('disk3', 'disk3mnt', 'NTFS', 'rw,fixed', 255, 260))
        self.mock_disk_partitions.append(sdiskpart('disk4', 'disk3mnt', 'NTFS', 'rw,fixed', 255, 260))

    def tearDown(self) -> None:
        self.mock_disk_partitions.clear()
        DiskInfo.objects.all().delete()
        return super().tearDown()

    @patch('diskpeeker.services.disk_service.psutil', side_effect=None)
    def test_init_disks(self, mock_psutil) -> bool:
        # TODO: implement
        return True

    @patch('diskpeeker.services.disk_service.psutil', side_effect=None)
    def test_get_disk_usages(self, mock_psutil) -> None:
        mock_psutil.disk_partitions = self.mocked_disk_partitions

        all_disks = DiskInfo.objects.all()
        all_disks_count: int = len(all_disks)
        disk_usages :List[DiskUsage] = DiskService.get_disk_usages(False)

        #asserts:
        self.assertListEqual(
            [disk.device for disk in all_disks], 
            [usage.device for usage in disk_usages])

    @patch('diskpeeker.services.disk_service.psutil', side_effect=None)
    def test_get_disk_usages_visible_only(self, mock_psutil) -> None:
        mock_psutil.disk_partitions = self.mocked_disk_partitions

        visisble_disks = DiskInfo.objects.filter(hidden = False)
        visible_disks_count: int = len(visisble_disks)
        disk_usages = DiskService.get_disk_usages(True)

        # asserts:
        self.assertListEqual(
            [disk.device for disk in visisble_disks], 
            [usage.device for usage in disk_usages])
        