# CaseShare

Веб-приложение на базе Django + React + SQLite для размещения кейсов от компаний и откликов студентов.

## Что реализовано

- Два типа пользователей: `company` и `student`
- Регистрация и вход с хешированием паролей средствами Django
- API на Django REST Framework с токен-авторизацией
- Главная страница с header/footer
- Для студентов: страница кейсов и отклик на кейс
- Для компаний: список студентов, отправка сообщения и публикация кейса
- Личный кабинет для обеих ролей

## Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

При необходимости API можно переопределить через `VITE_API_URL`.
