from django.urls import path

from .views import (
    CaseApplyView,
    CaseListCreateView,
    CaseSubmitForReviewView,
    CompanyDashboardView,
    ContactMessageView,
    HomeView,
    StudentDashboardView,
    StudentListView,
)


urlpatterns = [
    path("home/", HomeView.as_view(), name="home"),
    path("cases/", CaseListCreateView.as_view(), name="case-list"),
    path("cases/<int:case_id>/submit/", CaseSubmitForReviewView.as_view(), name="case-submit"),
    path("cases/<int:case_id>/apply/", CaseApplyView.as_view(), name="case-apply"),
    path("students/", StudentListView.as_view(), name="student-list"),
    path("students/<int:student_id>/contact/", ContactMessageView.as_view(), name="student-contact"),
    path("dashboard/company/", CompanyDashboardView.as_view(), name="company-dashboard"),
    path("dashboard/student/", StudentDashboardView.as_view(), name="student-dashboard"),
]
