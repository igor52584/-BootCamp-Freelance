import { Link, useNavigate } from "react-router-dom";

function AuthHeader({ user, onLogout }) {
  return (
    <header className="site-header">
      <div className="brand-block">
        <Link to="/" className="brand">
          CaseShare
        </Link>
      </div>
      <nav className="nav-center">
        <Link to="/" className="nav-link">
          Главная
        </Link>
        {user.role === "student" ? (
          <Link to="/cases" className="nav-link">
            Кейсы
          </Link>
        ) : (
          <Link to="/students" className="nav-link">
            Студенты
          </Link>
        )}
      </nav>
      <nav className="nav-actions">
        <Link to="/profile" className="button secondary">
          Личный кабинет
        </Link>
        <button type="button" className="button ghost" onClick={onLogout}>
          Выйти
        </button>
      </nav>
    </header>
  );
}

function GuestHeader() {
  return (
    <header className="site-header">
      <div className="brand-block">
        <Link to="/" className="brand">
          CaseShare
        </Link>
      </div>
      <nav className="nav-center">
        <Link to="/" className="nav-link">
          Главная
        </Link>
      </nav>
      <nav className="nav-actions">
        <Link to="/login" className="button secondary">
          Вход
        </Link>
        <Link to="/register" className="button primary">
          Регистрация
        </Link>
      </nav>
    </header>
  );
}

function Footer({ user }) {
  return (
    <footer className="site-footer">
      <div>
        <h3>CaseShare</h3>
        <p>Сервис, где компании публикуют кейсы, а студенты откликаются на них.</p>
      </div>
      <div>
        <h3>О нас</h3>
        <p>Помогаем компаниям находить мотивированных студентов, а студентам получать реальный опыт.</p>
      </div>
      <div>
        <h3>Поддержка</h3>
        <p>Если возникли вопросы или нужна помощь, напишите на <a href="mailto:support@caseshare.ru">support@caseshare.ru</a>.</p>
      </div>
      <div className="footer-links">
        <Link to="/">Главная</Link>
        {!user && <Link to="/login">Вход</Link>}
        {!user && <Link to="/register">Регистрация</Link>}
        {user && <Link to="/profile">Личный кабинет</Link>}
        {user?.role === "student" && <Link to="/cases">Кейсы</Link>}
        {user?.role === "company" && <Link to="/students">Студенты</Link>}
      </div>
    </footer>
  );
}

export function AppLayout({ user, setUser, children }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  }

  return (
    <div className="page-shell">
      {user ? <AuthHeader user={user} onLogout={logout} /> : <GuestHeader />}
      <main className="page-content">{children}</main>
      <Footer user={user} />
    </div>
  );
}
