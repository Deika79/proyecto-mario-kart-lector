import { obtenerAlumnos, registrarMinutos } from './api.js';
import { pintarCoches } from './circuito.js';
import { pintarRanking } from './ranking.js';

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

  const alumnosPadre = await obtenerAlumnos();

  if (!alumnosPadre || alumnosPadre.length === 0) {
    console.warn("El padre no tiene alumnos asociados");
    return;
  }

  alumnoSelect.innerHTML = '';

  alumnosPadre.forEach(alumno => {

    const option = document.createElement('option');
    option.value = alumno._id;
    option.textContent = alumno.nombre;

    alumnoSelect.appendChild(option);

  });

  // Primer hijo seleccionado
  const hijoId = alumnosPadre[0]._id;

  // Obtener todos los alumnos para circuito y ranking
  const alumnosCircuito = await obtenerAlumnosCircuito();

  if (!alumnosCircuito || alumnosCircuito.length === 0) {
    console.warn("No hay alumnos para pintar circuito");
    return;
  }

  // Pintar circuito
  pintarCoches(alumnosCircuito, true, hijoId);

  // Pintar ranking
  pintarRanking(alumnosCircuito, true, hijoId);

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

    cargarAlumnos();

  } catch (error) {

    mensaje.textContent = error.message;

  }

});


const circuitoImg = document.getElementById("circuito");

if (circuitoImg.complete) {
  cargarAlumnos();
} else {
  circuitoImg.onload = cargarAlumnos;
}