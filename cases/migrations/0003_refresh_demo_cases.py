from django.db import migrations


DEMO_CASES = [
    {
        "old_title": "Сократить время обработки заявок на доставку",
        "title": "Оптимизация обработки срочных заявок в логистике",
        "description": "Нужно предложить понятный сценарий работы для операторов и концепт дашборда, который поможет быстрее распределять срочные заявки между складами и курьерами в часы пик.",
    },
    {
        "old_title": "Проверить гипотезу по удержанию пользователей финтех-сервиса",
        "title": "Анализ удержания пользователей финтех-сервиса",
        "description": "Команда запускает обновленный онбординг и хочет оценить его влияние на возвращаемость пользователей. Требуется описать план исследования, ключевые метрики и подход к сравнению результатов.",
    },
    {
        "old_title": "Подготовить концепт внутренней базы знаний для HR-команды",
        "title": "Концепция базы знаний для HR-команды",
        "description": "Компания масштабирует найм и адаптацию сотрудников. Нужна структура внутренней базы знаний, примеры ключевых разделов и предложения по тому, как поддерживать материалы в актуальном состоянии.",
    },
]


def refresh_demo_cases(apps, schema_editor):
    Case = apps.get_model("cases", "Case")
    User = apps.get_model("users", "User")

    demo_company, _ = User.objects.get_or_create(
        username="astra_logistics",
        defaults={
            "full_name": "Astra Logistics",
            "role": "company",
            "about": "Демо-компания для витрины кейсов в сфере логистики и цифровых продуктов.",
            "email": "",
            "password": "",
        },
    )

    if demo_company.full_name != "Astra Logistics":
        demo_company.full_name = "Astra Logistics"
        demo_company.about = "Демо-компания для витрины кейсов в сфере логистики и цифровых продуктов."
        demo_company.save(update_fields=["full_name", "about"])

    for item in DEMO_CASES:
        Case.objects.filter(title=item["old_title"]).update(
            company=demo_company,
            title=item["title"],
            description=item["description"],
            status="published",
        )


def rollback_demo_cases(apps, schema_editor):
    Case = apps.get_model("cases", "Case")

    for item in DEMO_CASES:
        Case.objects.filter(title=item["title"]).update(
            title=item["old_title"],
        )


class Migration(migrations.Migration):

    dependencies = [
        ("cases", "0002_case_review_submitted_at_case_status"),
    ]

    operations = [
        migrations.RunPython(refresh_demo_cases, rollback_demo_cases),
    ]
