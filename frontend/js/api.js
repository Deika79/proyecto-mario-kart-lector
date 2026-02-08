const API_URL = 'http://localhost:3000/api';

// Obtener posiciones
export async function obtenerPosiciones() {
  try {
    const res = await fetch(`${API_URL}/posiciones`);
    return await res.json();
  } catch (error) {
    console.error('Error obteniendo posiciones:', error);
    return [];
  }
}

// Obtener alumnos
export async function obtenerAlumnos() {
  try {
    const res = await fetch(`${API_URL}/alumnos`);
    return await res.json();
  } catch (error) {
    console.error('Error obteniendo alumnos:', error);
    return [];
  }
}

// Registrar minutos
export async function registrarMinutos(alumnoId, minutos) {
  try {
    const res = await fetch(`${API_URL}/registros`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ alumnoId, minutos })
    });
    return await res.json();
  } catch (error) {
    console.error('Error registrando minutos:', error);
    return { error: error.message };
  }
}
