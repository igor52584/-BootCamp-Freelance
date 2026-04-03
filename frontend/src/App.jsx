import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { api } from "./api";
import { AppLayout } from "./components/AppLayout";
import { CasesPage } from "./pages/CasesPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { StudentsPage } from "./pages/StudentsPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api("/auth/me/")
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="screen-center">Загрузка...</div>;
  }

  return (
    <AppLayout user={user} setUser={setUser}>
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/login" element={user ? <Navigate to="/profile" replace /> : <LoginPage setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/profile" replace /> : <RegisterPage setUser={setUser} />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} setUser={setUser} /> : <Navigate to="/login" replace />} />
        <Route
          path="/cases"
          element={user?.role === "company" || user?.role === "student" ? <CasesPage user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/students"
          element={user?.role === "company" ? <StudentsPage /> : <Navigate to={user ? "/profile" : "/login"} replace />}
        />
      </Routes>
    </AppLayout>
  );
}
