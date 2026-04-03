from rest_framework import serializers

from users.models import User
from users.serializers import UserSerializer

from .models import Case, CaseApplication, ContactMessage


class CaseSerializer(serializers.ModelSerializer):
    company = UserSerializer(read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Case
        fields = ("id", "title", "description", "status", "status_display", "review_submitted_at", "created_at", "company")


class CaseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = ("title", "description")


class CaseApplicationSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)

    class Meta:
        model = CaseApplication
        fields = ("id", "student", "motivation", "created_at")


class ApplySerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseApplication
        fields = ("motivation",)


class StudentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "full_name", "username", "email", "about")


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ("id", "student", "message", "created_at")
