const API_URL = "http://localhost:5000/api";

export async function obtenerAlumnos() {
  try {
    const res = await fetch(`${API_URL}/alumnos`);
    return await res.json();
  } catch (error) {
    console.error("Error obteniendo alumnos:", error);
  }
}

export async function obtenerPosiciones() {
  try {
    const res = await fetch(`${API_URL}/alumnos`);
    return await res.json();
  } catch (error) {
    console.error("Error obteniendo posiciones:", error);
  }
}

// ✅ Añade la función que estaba faltando
export async function registrarMinutos(alumnoId, minutos) {
  try {
    const res = await fetch(`${API_URL}/registros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alumnoId, minutos })
    });
    return await res.json();
  } catch (error) {
    console.error("Error registrando minutos:", error);
  }
}
