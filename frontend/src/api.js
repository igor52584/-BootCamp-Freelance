const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function extractFirstError(payload) {
  if (!payload || typeof payload !== "object") {
    return { message: "Ошибка запроса", fields: [] };
  }

  for (const [key, value] of Object.entries(payload)) {
    if (Array.isArray(value) && value.length > 0) {
      return { message: String(value[0]), fields: [key] };
    }
    if (typeof value === "string" && value.trim()) {
      return { message: value, fields: [key] };
    }
  }

  return { message: "Ошибка запроса", fields: [] };
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const { message, fields } = extractFirstError(payload);
    const error = new Error(message);
    error.payload = payload;
    error.fields = fields;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}
