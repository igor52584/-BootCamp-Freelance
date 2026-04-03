from django.conf import settings
from django.db import models


class Case(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Черновик"
        PENDING_REVIEW = "pending_review", "На рассмотрении"
        PUBLISHED = "published", "Опубликован"

    company = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cases")
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    review_submitted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class CaseApplication(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="applications")
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="applications")
    motivation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("case", "student")
        ordering = ("-created_at",)


class ContactMessage(models.Model):
    company = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages")
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_messages")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
