from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Дополнительно", {"fields": ("role", "full_name", "about")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Дополнительно", {"fields": ("role", "full_name", "about")}),
    )
    list_display = ("username", "full_name", "role", "email", "is_staff")
