import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export function LoginPage({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [invalidFields, setInvalidFields] = useState([]);

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

    try {
      const data = await api("/auth/login/", {
        method: "POST",
        body: JSON.stringify(form)
      });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
      if (err.fields?.includes("username") || err.fields?.includes("password")) {
        setInvalidFields(err.fields);
      } else {
        setInvalidFields(["username", "password"]);
      }
    }
  }

  return (
    <section className="panel auth-panel">
      <h1>Вход</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          className={invalidFields.includes("username") ? "input-error" : ""}
          placeholder="Логин"
          value={form.username}
          onChange={(e) => updateField("username", e.target.value)}
        />
        <input
          type="password"
          className={invalidFields.includes("password") ? "input-error" : ""}
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <button className="button primary" type="submit">
          Войти
        </button>
      </form>
    </section>
  );
}
