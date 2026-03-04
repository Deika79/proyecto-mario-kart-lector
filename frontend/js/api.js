const API_URL = "http://localhost:5000/api";

/* =========================
   LOGIN
========================= */
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error en login");
  }

  return data;
}

/* =========================
   OBTENER ALUMNOS (PROTEGIDO)
========================= */
export async function obtenerAlumnos() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/alumnos`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("No autorizado");

    return await res.json();
  } catch (error) {
    console.error("Error obteniendo alumnos:", error);
    return [];
  }
}

/* =========================
   REGISTRAR MINUTOS (PROTEGIDO)
========================= */
export async function registrarMinutos(alumnoId, minutos) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/registros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ alumnoId, minutos })
    });

    if (!res.ok) throw new Error("Error registrando minutos");

    return await res.json();
  } catch (error) {
    console.error("Error registrando minutos:", error);
    return null;
  }
}