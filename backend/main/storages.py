from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage as DefaultS3Boto3Storage


class S3Boto3Storage(DefaultS3Boto3Storage):
    location = settings.AWS_MEDIA_LOCATION
