from django.test import TestCase
from unittest.mock import patch
from psutil._common import sdiskpart
from diskpeeker.services.disk_service import DiskService
from diskpeeker.models.disk_models import DiskInfo, DiskUsage

class DiskServiceTestCase(TestCase):

    mock_disk_partitions: list[sdiskpart] = list()
    mock_persisted_disks: list[DiskInfo] = [
            DiskInfo(device="disk1", name="disk1-name", hidden=False),
            DiskInfo(device="disk2", name="disk2-name", hidden=False),
            DiskInfo(device="disk3", name="disk3-name", hidden=True),
            DiskInfo(device="disk4", name="disk4-name", hidden=True)
        ]

    def mocked_disk_partitions(self) -> list[sdiskpart]:
        return self.mock_disk_partitions 
    
    def setUp(self) -> None:
        DiskInfo.objects.bulk_create(self.mock_persisted_disks)

        self.mock_disk_partitions.extend([
            sdiskpart('disk1', 'disk1mnt', 'NTFS', 'rw,fixed', 255, 260),
            sdiskpart('disk2', 'disk2mnt', 'NTFS', 'rw,fixed', 255, 260),
            sdiskpart('disk3', 'disk3mnt', 'NTFS', 'rw,fixed', 255, 260),
            sdiskpart('disk4', 'disk3mnt', 'NTFS', 'rw,fixed', 255, 260)
        ])

    def tearDown(self) -> None:
        self.mock_disk_partitions.clear()
        DiskInfo.objects.all().delete()
        return super().tearDown()

    @patch('diskpeeker.services.disk_service.psutil', side_effect=None)
    def test_init_disks_empty_db(self, mock_psutil) -> None:
        mock_psutil.disk_partitions = self.mocked_disk_partitions

        DiskInfo.objects.all().delete()
        DiskService.init_disks()

        #asserts:
        self.assertListEqual(
            [disk.device for disk in self.mock_persisted_disks],
            [disk.device for disk in list(DiskInfo.objects.all())]
        ) 

    @patch('diskpeeker.services.disk_service.psutil', side_effect=None)
    def test_init_disks_no_db_changes(self, mock_psutil) -> None:
        mock_psutil.disk_partitions = self.mocked_disk_partitions
        DiskService.init_disks()

        #asserts:
        self.assertListEqual(
            [disk.device for disk in self.mock_persisted_disks],
            [disk.device for disk in list(DiskInfo.objects.all())]
        )

    @patch('diskpeeker.services.disk_service.psutil', side_effect=None)
    def test_init_disks_outdated_db(self, mock_psutil) -> None:
        new_disk: DiskInfo = DiskInfo(device="new-disk", name="new-disk-name", hidden=True)
        self.mock_disk_partitions.append(new_disk)
        mock_psutil.disk_partitions = self.mocked_disk_partitions

        DiskService.init_disks()

        #asserts:
        self.assertListEqual(
            [disk.device for disk in self.mock_persisted_disks + [new_disk]],
            [disk.device for disk in list(DiskInfo.objects.all())]
        ) 

    @patch('diskpeeker.services.disk_service.psutil', side_effect=None)
    def test_get_disk_usages(self, mock_psutil) -> None:
        mock_psutil.disk_partitions = self.mocked_disk_partitions

        all_disks = DiskInfo.objects.all()
        disk_usages: list[DiskUsage] = DiskService.get_disk_usages(False)

        #asserts:
        self.assertListEqual(
            [disk.device for disk in all_disks], 
            [usage.device for usage in disk_usages])

    @patch('diskpeeker.services.disk_service.psutil', side_effect=None)
    def test_get_disk_usages_visible_only(self, mock_psutil) -> None:
        mock_psutil.disk_partitions = self.mocked_disk_partitions

        visisble_disks: list[DiskInfo] = list(DiskInfo.objects.filter(hidden = False))
        disk_usages: list[DiskUsage] = DiskService.get_disk_usages(True)

        # asserts:
        self.assertListEqual(
            [disk.device for disk in visisble_disks], 
            [usage.device for usage in disk_usages])
        