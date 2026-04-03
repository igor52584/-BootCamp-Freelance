from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = "student", "Студент"
        COMPANY = "company", "Компания"

    role = models.CharField(max_length=20, choices=Role.choices)
    full_name = models.CharField(max_length=255)
    about = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"
