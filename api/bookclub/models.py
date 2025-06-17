from django.db import models


class Integration(models.Model):
    id: models.AutoField = models.AutoField(primary_key=True)
    name: models.CharField = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "integration"


class BookClub(models.Model):
    id: models.CharField = models.CharField(max_length=255, primary_key=True)
    url: models.CharField = models.CharField(max_length=255, unique=True)
    author: models.CharField = models.CharField(max_length=255)
    book: models.CharField = models.CharField(max_length=500)
    date: models.DateField = models.DateField()
    integration: models.ForeignKey = models.ForeignKey(
        Integration, on_delete=models.CASCADE, db_column="integration_id"
    )

    class Meta:
        db_table = "book_club"
