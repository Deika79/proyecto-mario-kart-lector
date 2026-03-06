import { obtenerAlumnos, registrarMinutos } from './api.js';
import { pintarCoches } from './circuito.js';

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://mario-kart-lector-backend.onrender.com/api";

const token = localStorage.getItem("token");
const rol = localStorage.getItem("rol");

if (!token || rol !== "padre") {
  window.location.href = "index.html";
}

const form = document.getElementById('registroForm');
const alumnoSelect = document.getElementById('alumnoId');
const mensaje = document.getElementById('mensaje');
const minutosInput = document.getElementById('minutos');
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  window.location.href = "index.html";
});

/**
 * Obtener alumnos para el circuito (todos)
 */
async function obtenerAlumnosCircuito() {

  const res = await fetch(`${API_URL}/alumnos/circuito`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    console.error("Error obteniendo alumnos del circuito");
    return [];
  }

  return await res.json();
}


/**
 * Cargar alumnos
 */
async function cargarAlumnos() {

  // Este endpoint devuelve solo su hijo
  const alumnosPadre = await obtenerAlumnos();

  alumnoSelect.innerHTML = '';

  alumnosPadre.forEach(alumno => {
    const option = document.createElement('option');
    option.value = alumno._id;
    option.textContent = alumno.nombre;
    alumnoSelect.appendChild(option);
  });

  if (alumnosPadre.length === 0) return;

  const hijoId = alumnosPadre[0]._id;

  // Este endpoint devuelve TODOS para el circuito
  const alumnosCircuito = await obtenerAlumnosCircuito();

  pintarCoches(alumnosCircuito, true, hijoId);

}


/**
 * Registrar minutos
 */
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const alumnoId = alumnoSelect.value;
  const minutos = Number(minutosInput.value);

  if (!alumnoId || isNaN(minutos) || minutos <= 0) {
    mensaje.textContent = "Introduce un número válido de minutos.";
    return;
  }

  try {

    await registrarMinutos(alumnoId, minutos);

    mensaje.textContent = "Minutos registrados correctamente.";
    minutosInput.value = "";

    // refrescar circuito
    cargarAlumnos();

  } catch (error) {

    mensaje.textContent = error.message;

  }

});


cargarAlumnos();