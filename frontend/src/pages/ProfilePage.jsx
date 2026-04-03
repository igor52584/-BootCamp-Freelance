import { useEffect, useState } from "react";
import { api } from "../api";

export function ProfilePage({ user, setUser }) {
  const [dashboard, setDashboard] = useState(null);
  const [about, setAbout] = useState(user.about || "");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const path = user.role === "company" ? "/dashboard/company/" : "/dashboard/student/";
    api(path).then(setDashboard).catch(() => setDashboard(null));
  }, [user]);

  useEffect(() => {
    setAbout(user.about || "");
  }, [user.about]);

  async function saveAbout(event) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const updatedUser = await api("/auth/me/", {
        method: "PATCH",
        body: JSON.stringify({ about })
      });
      setUser(updatedUser);
      setStatus("Описание сохранено.");
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="stack">
      <div className="panel">
        <span className="eyebrow">Личный кабинет</span>
        <h1>{user.full_name}</h1>
        <div className="meta-grid">
          <div>
            <strong>Логин</strong>
            <p>{user.username}</p>
          </div>
          <div>
            <strong>Роль</strong>
            <p>{user.role === "student" ? "Студент" : "Компания"}</p>
          </div>
          <div>
            <strong>Контакт</strong>
            <p>{user.email || "Не указан"}</p>
          </div>
        </div>
        <form className="form-grid profile-form" onSubmit={saveAbout}>
          <label className="field-label" htmlFor="about">
            Кратко о себе
          </label>
          <textarea
            id="about"
            placeholder="Добавьте информацию о себе или о компании"
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            rows="5"
          />
          {status && <p className={status === "Описание сохранено." ? "success-text" : "error-text"}>{status}</p>}
          <button className="button primary" type="submit" disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </form>
      </div>
      {user.role === "company" ? <CompanyDashboard dashboard={dashboard} /> : <StudentDashboard dashboard={dashboard} />}
    </section>
  );
}

function CompanyDashboard({ dashboard }) {
  return (
    <div className="panel">
      <h2>Активность компании</h2>
      <p>Создано кейсов: {dashboard?.cases?.length ?? 0}</p>
      <div className="list-grid">
        {(dashboard?.applications || []).map((item) => (
          <article className="list-card" key={item.id}>
            <h3>{item.case_title}</h3>
            <p>{item.student.full_name}</p>
            <p>{item.motivation}</p>
          </article>
        ))}
        {!dashboard?.applications?.length && <p>Откликов пока нет.</p>}
      </div>
    </div>
  );
}

function StudentDashboard({ dashboard }) {
  return (
    <div className="panel">
      <h2>Мои отклики</h2>
      <div className="list-grid">
        {(dashboard?.applications || []).map((item) => (
          <article className="list-card" key={item.id}>
            <h3>{item.case_title}</h3>
            <p>{item.company_name}</p>
            <p>{item.motivation}</p>
          </article>
        ))}
        {!dashboard?.applications?.length && <p>Вы еще не откликались на кейсы.</p>}
      </div>
    </div>
  );
}
