const API_URL = 'http://localhost:3000/api/posiciones';

export async function obtenerPosiciones() {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (error) {
    console.error('Error obteniendo posiciones:', error);
    return [];
  }
}
