import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";

const initialState = {
  username: "",
  password: "",
  full_name: "",
  email: "",
  role: "student"
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterPage({ setUser }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [invalidFields, setInvalidFields] = useState([]);

  useEffect(() => {
    const role = searchParams.get("role");
    if (role === "student" || role === "company") {
      setForm((current) => ({ ...current, role }));
    }
  }, [searchParams]);

  function updateField(name, value) {
    setForm({ ...form, [name]: value });
    setInvalidFields((current) => current.filter((field) => field !== name));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setInvalidFields([]);

    if (!form.username.trim()) {
      setError("Введите логин.");
      setInvalidFields(["username"]);
      return;
    }

    if (!form.password) {
      setError("Введите пароль.");
      setInvalidFields(["password"]);
      return;
    }

    if (form.password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов.");
      setInvalidFields(["password"]);
      return;
    }

    if (!form.full_name.trim()) {
      setError(form.role === "student" ? "Введите ФИО." : "Введите название компании.");
      setInvalidFields(["full_name"]);
      return;
    }

    if (form.email && !emailPattern.test(form.email)) {
      setError("Введите корректный email.");
      setInvalidFields(["email"]);
      return;
    }

    try {
      const data = await api("/auth/register/", {
        method: "POST",
        body: JSON.stringify(form)
      });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
      setInvalidFields(err.fields?.length ? err.fields : []);
    }
  }

  return (
    <section className="panel auth-panel">
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit} className="form-grid" noValidate>
        <div className="role-switch">
          <button type="button" className={form.role === "student" ? "active" : ""} onClick={() => setForm({ ...form, role: "student" })}>
            Студент
          </button>
          <button type="button" className={form.role === "company" ? "active" : ""} onClick={() => setForm({ ...form, role: "company" })}>
            Компания
          </button>
        </div>
        <input
          className={invalidFields.includes("username") ? "input-error" : ""}
          placeholder="Логин"
          value={form.username}
          onChange={(e) => updateField("username", e.target.value)}
          required
        />
        <input
          type="password"
          className={invalidFields.includes("password") ? "input-error" : ""}
          placeholder="Пароль не короче 8 символов"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          required
        />
        <input
          className={invalidFields.includes("full_name") ? "input-error" : ""}
          placeholder={form.role === "student" ? "ФИО" : "Название компании"}
          value={form.full_name}
          onChange={(e) => updateField("full_name", e.target.value)}
          required
        />
        <input
          type="text"
          inputMode="email"
          className={invalidFields.includes("email") ? "input-error" : ""}
          placeholder="Email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <button className="button primary" type="submit">
          Создать аккаунт
        </button>
      </form>
    </section>
  );
}
