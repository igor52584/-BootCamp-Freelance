import { useEffect, useState } from "react";
import { api } from "../api";

export function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    api("/students/").then(setStudents).catch((err) => setError(err.message));
  }, []);

  async function sendMessage(studentId) {
    try {
      await api(`/students/${studentId}/contact/`, {
        method: "POST",
        body: JSON.stringify({ student: studentId, message: messages[studentId] || "" })
      });
      setMessages({ ...messages, [studentId]: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel">
      <h1>Список студентов</h1>
      {error && <p className="error-text">{error}</p>}
      <div className="list-grid">
        {students.map((student) => (
          <article className="list-card" key={student.id}>
            <h3>{student.full_name}</h3>
            <p>{student.about || "Описание отсутствует."}</p>
            <p>Email: {student.email || "Не указан"}</p>
            <textarea
              rows="3"
              placeholder="Сообщение студенту"
              value={messages[student.id] || ""}
              onChange={(e) => setMessages({ ...messages, [student.id]: e.target.value })}
            />
            <button type="button" className="button secondary" onClick={() => sendMessage(student.id)}>
              Написать
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
