from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import User

from .models import Case, CaseApplication, ContactMessage
from .permissions import IsCompany, IsStudent
from .serializers import (
    ApplySerializer,
    CaseApplicationSerializer,
    CaseCreateSerializer,
    CaseSerializer,
    ContactMessageSerializer,
    StudentListSerializer,
)


class HomeView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"title": "Главная страница", "content": ""})


class CaseListCreateView(generics.ListCreateAPIView):
    queryset = Case.objects.select_related("company").all()

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsCompany()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CaseCreateSerializer
        return CaseSerializer

    def get_queryset(self):
        queryset = Case.objects.select_related("company")
        user = self.request.user
        if user.is_authenticated and getattr(user, "role", None) == User.Role.COMPANY:
            return queryset.filter(Q(status=Case.Status.PUBLISHED) | Q(company=user)).distinct()
        return queryset.filter(status=Case.Status.PUBLISHED)

    def perform_create(self, serializer):
        serializer.save(company=self.request.user, status=Case.Status.DRAFT)


class CaseSubmitForReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsCompany]

    def post(self, request, case_id):
        case = get_object_or_404(Case, pk=case_id, company=request.user)

        if case.status == Case.Status.PENDING_REVIEW:
            return Response({"detail": "Кейс уже отправлен на рассмотрение."}, status=status.HTTP_400_BAD_REQUEST)

        if case.status == Case.Status.PUBLISHED:
            return Response({"detail": "Кейс уже опубликован."}, status=status.HTTP_400_BAD_REQUEST)

        case.status = Case.Status.PENDING_REVIEW
        case.review_submitted_at = timezone.now()
        case.save(update_fields=["status", "review_submitted_at"])
        return Response(CaseSerializer(case).data, status=status.HTTP_200_OK)


class CaseApplyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def post(self, request, case_id):
        case = get_object_or_404(Case, pk=case_id)
        serializer = ApplySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application, created = CaseApplication.objects.get_or_create(
            case=case,
            student=request.user,
            defaults={"motivation": serializer.validated_data["motivation"]},
        )
        if not created:
            application.motivation = serializer.validated_data["motivation"]
            application.save(update_fields=["motivation"])
        return Response(CaseApplicationSerializer(application).data, status=status.HTTP_201_CREATED)


class StudentListView(generics.ListAPIView):
    serializer_class = StudentListSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompany]

    def get_queryset(self):
        return User.objects.filter(role=User.Role.STUDENT).order_by("full_name", "username")


class ContactMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsCompany]

    def post(self, request, student_id):
        student = get_object_or_404(User, pk=student_id, role=User.Role.STUDENT)
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = ContactMessage.objects.create(
            company=request.user,
            student=student,
            message=serializer.validated_data["message"],
        )
        return Response(ContactMessageSerializer(message).data, status=status.HTTP_201_CREATED)


class CompanyDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsCompany]

    def get(self, request):
        cases = Case.objects.filter(company=request.user)
        applications = CaseApplication.objects.filter(case__company=request.user).select_related("student", "case")
        return Response(
            {
                "cases": CaseSerializer(cases, many=True).data,
                "applications": [
                    {
                        "id": application.id,
                        "case_title": application.case.title,
                        "student": StudentListSerializer(application.student).data,
                        "motivation": application.motivation,
                        "created_at": application.created_at,
                    }
                    for application in applications
                ],
            }
        )


class StudentDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get(self, request):
        applications = CaseApplication.objects.filter(student=request.user).select_related("case", "case__company")
        return Response(
            {
                "applications": [
                    {
                        "id": application.id,
                        "case_title": application.case.title,
                        "company_name": application.case.company.full_name,
                        "motivation": application.motivation,
                        "created_at": application.created_at,
                    }
                    for application in applications
                ]
            }
        )
