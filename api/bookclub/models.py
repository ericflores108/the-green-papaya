from django.db import models


class BookClub(models.Model):
    url: models.TextField = models.TextField(primary_key=True)
    author: models.CharField = models.CharField(max_length=255)
    book: models.CharField = models.CharField(max_length=500)
    date: models.DateField = models.DateField()
    integration_id: models.IntegerField = models.IntegerField()

    class Meta:
        db_table = "book_club"


class Integration(models.Model):
    id: models.AutoField = models.AutoField(primary_key=True)
    name: models.CharField = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "integration"
