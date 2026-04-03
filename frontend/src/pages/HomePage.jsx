import { Link } from "react-router-dom";

const WHY_POINTS = [
  {
    title: "Реальные задачи",
    description: "Не учебные абстракции, а кейсы с ограничениями, сроками и контекстом бизнеса."
  },
  {
    title: "Прозрачный отбор",
    description: "Компании видят способ мышления, а не только красивое резюме."
  },
  {
    title: "Быстрый старт",
    description: "Создание профиля и первый отклик занимают считанные минуты."
  }
];

const FLOW_STEPS = [
  "Компания публикует кейс и получает отклики от мотивированных студентов.",
  "Студент выбирает задачу по интересу и показывает подход в отклике.",
  "Обе стороны быстро выходят на контакт и переходят к следующему шагу."
];

const STUDENT_ACTIONS = [
  {
    title: "Подобрать кейс",
    description: "Откройте список задач и найдите то, что прокачает навык уже сегодня.",
    to: "/cases",
    button: "Открыть кейсы"
  },
  {
    title: "Усилить профиль",
    description: "Заполните описание в профиле, чтобы компаниям было проще выйти на контакт.",
    to: "/profile",
    button: "Перейти в профиль"
  }
];

const COMPANY_ACTIONS = [
  {
    title: "Опубликовать кейс",
    description: "Добавьте новую задачу и начните собирать отклики от мотивированных студентов.",
    to: "/cases",
    button: "К моим кейсам"
  },
  {
    title: "Посмотреть студентов",
    description: "Изучите профили, выберите подходящих кандидатов и напишите первым.",
    to: "/students",
    button: "Найти студентов"
  }
];

const STUDENT_FOCUS = [
  "Выберите 1 кейс, который соответствует вашему текущему уровню.",
  "Напишите короткий и предметный отклик с вашей мотивацией.",
  "Обновите профиль так, чтобы вас было легко оценить за 30 секунд."
];

const COMPANY_FOCUS = [
  "Сформулируйте кейс с понятной целью и ожидаемым результатом.",
  "Быстро отвечайте на сильные отклики, пока у кандидатов высокий интерес.",
  "Смотрите на логику решения, а не только на формальный опыт."
];

export function HomePage({ user }) {
  if (user) {
    const isStudent = user.role === "student";
    const actions = isStudent ? STUDENT_ACTIONS : COMPANY_ACTIONS;
    const focusPoints = isStudent ? STUDENT_FOCUS : COMPANY_FOCUS;

    return (
      <section className="stack member-home">
        <div className="panel member-hero">
          <span className="eyebrow">Рабочая зона</span>
          <h1>{user.full_name || "Рады видеть вас снова"}</h1>
          <p className="hero-lead">
            {isStudent
              ? "Вы в роли студента: берите задачи, набирайте практику и превращайте отклики в реальные карьерные контакты."
              : "Вы в роли компании: публикуйте кейсы, отслеживайте отклики и находите студентов с нужным подходом к задачам."}
          </p>
          <div className="member-hero-actions">
            <Link to={isStudent ? "/cases" : "/students"} className="button primary">
              {isStudent ? "Перейти к кейсам" : "Найти студентов"}
            </Link>
            <Link to="/profile" className="button ghost">
              Личный кабинет
            </Link>
          </div>
        </div>

        <section className="panel member-panel">
          <span className="eyebrow">Быстрые действия</span>
          <div className="list-grid">
            {actions.map((item) => (
              <article className="list-card member-card" key={item.title}>
                <h3>{item.title}</h3>
                <p className="muted-text">{item.description}</p>
                <Link to={item.to} className="button secondary">
                  {item.button}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="panel member-panel">
          <span className="eyebrow">Фокус на сегодня</span>
          <div className="home-flow member-flow">
            {focusPoints.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="stack guest-home">
      <div className="hero guest-hero">
        <div className="hero-card guest-hero-card">
          <span className="eyebrow">Lark</span>
          <h1>Учеба встречается с реальными задачами бизнеса</h1>
          <p className="hero-lead">Одна платформа, где студенты получают практику, а компании находят сильных кандидатов через кейсы.</p>
          <div className="guest-cta">
            <Link to="/register?role=student" className="button primary">
              Я студент
            </Link>
            <Link to="/register?role=company" className="button secondary">
              Я компания
            </Link>
          </div>
        </div>
      </div>

      <section className="panel">
        <span className="eyebrow">Почему это работает</span>
        <div className="list-grid">
          {WHY_POINTS.map((item) => (
            <article className="list-card" key={item.title}>
              <h3>{item.title}</h3>
              <p className="muted-text">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <span className="eyebrow">Как это происходит</span>
        <div className="home-flow">
          {FLOW_STEPS.map((step) => (
            <p key={step}>{step}</p>
          ))}
        </div>
      </section>

      <div className="panel guest-final">
        <h2>Начните сегодня</h2>
        <p className="muted-text">Выберите роль, создайте профиль и переходите к первому кейсу.</p>
        <div className="guest-cta">
          <Link to="/register?role=student" className="button primary">
            Регистрация студента
          </Link>
          <Link to="/register?role=company" className="button ghost">
            Регистрация компании
          </Link>
        </div>
      </div>
    </section>
  );
}
