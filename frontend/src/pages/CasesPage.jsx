import { useEffect, useState } from "react";
import { api } from "../api";

const STATUS_COPY = {
  draft: "Черновик",
  pending_review: "На рассмотрении",
  published: "Опубликован"
};

export function CasesPage({ user }) {
  const [cases, setCases] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createForm, setCreateForm] = useState({ title: "", description: "" });
  const [applicationText, setApplicationText] = useState({});

  function loadCases() {
    api("/cases/")
      .then((data) => {
        setCases(data);
        setError("");
      })
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadCases();
  }, []);

  async function createCase(event) {
    event.preventDefault();
    try {
      await api("/cases/", {
        method: "POST",
        body: JSON.stringify(createForm)
      });
      setCreateForm({ title: "", description: "" });
      setSuccessMessage("Кейс сохранён как черновик. Его можно отправить менеджеру ниже.");
      loadCases();
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitForReview(caseId) {
    try {
      await api(`/cases/${caseId}/submit/`, {
        method: "POST"
      });
      setSuccessMessage("Кейс отмечен как отправленный на рассмотрение менеджеру.");
      loadCases();
    } catch (err) {
      setError(err.message);
    }
  }

  async function applyToCase(caseId) {
    try {
      await api(`/cases/${caseId}/apply/`, {
        method: "POST",
        body: JSON.stringify({ motivation: applicationText[caseId] || "" })
      });
      setApplicationText({ ...applicationText, [caseId]: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  const companyCases = user.role === "company" ? cases.filter((item) => item.company.id === user.id) : [];
  const publishedCases = user.role === "company" ? cases.filter((item) => item.status === "published" && item.company.id !== user.id) : cases;

  return (
    <section className="stack">
      {user.role === "company" && (
        <>
          <div className="panel">
            <h1>Новый кейс</h1>
            <form className="form-grid" onSubmit={createCase}>
              <input placeholder="Название кейса" value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} required />
              <textarea
                rows="5"
                placeholder="Описание задачи"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                required
              />
              <button type="submit" className="button primary">
                Сохранить как черновик
              </button>
            </form>
          </div>
          <div className="panel">
            <h2>Мои кейсы</h2>
            <p className="muted-text">Черновики можно отправить менеджеру на рассмотрение. Пока это локальная заглушка без реальной отправки.</p>
            {!companyCases.length && <p>У вас пока нет созданных кейсов.</p>}
            <div className="list-grid">
              {companyCases.map((item) => (
                <article className="list-card" key={item.id}>
                  <div className="card-row">
                    <span className="eyebrow">Мой кейс</span>
                    <span className={`status-pill status-${item.status}`}>{STATUS_COPY[item.status] || item.status_display}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.status === "pending_review" && <p className="muted-text">Отправлен менеджеру и ожидает решения.</p>}
                  {item.status === "draft" && (
                    <button type="button" className="button secondary" onClick={() => submitForReview(item.id)}>
                      Отправить менеджеру
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="panel">
        <h2>{user.role === "student" ? "Доступные кейсы" : "Опубликованные кейсы"}</h2>
        {error && <p className="error-text">{error}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}
        <div className="list-grid">
          {publishedCases.map((item) => (
            <article className={`list-card ${user.role === "student" ? "case-card" : ""}`} key={item.id}>
              <div className="card-row">
                <span className="eyebrow">{item.company.full_name}</span>
                <span className={`status-pill status-${item.status}`}>{STATUS_COPY[item.status] || item.status_display}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {user.role === "student" && (
                <div className="case-card-actions">
                  <textarea
                    rows="3"
                    placeholder="Почему вы хотите взять этот кейс"
                    value={applicationText[item.id] || ""}
                    onChange={(e) => setApplicationText({ ...applicationText, [item.id]: e.target.value })}
                  />
                  <button type="button" className="button secondary" onClick={() => applyToCase(item.id)}>
                    Откликнуться
                  </button>
                </div>
              )}
            </article>
          ))}
          {!publishedCases.length && <p>Опубликованных кейсов пока нет.</p>}
        </div>
      </div>
    </section>
  );
}
