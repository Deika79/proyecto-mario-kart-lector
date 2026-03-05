import { pintarCoches } from './circuito.js';
import { obtenerAlumnos, crearAlumno } from './api.js';

const token = localStorage.getItem("token");
const rol = localStorage.getItem("rol");

if (!token || rol !== "profesor") {
  window.location.href = "index.html";
}

const logoutBtn = document.getElementById("logoutBtn");
const formCrear = document.getElementById("crearAlumnoForm");
const mensajeCrear = document.getElementById("mensajeCrear");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  window.location.href = "index.html";
});

async function cargarAlumnos() {
  try {
    const alumnos = await obtenerAlumnos();
    pintarCoches(alumnos);
  } catch (error) {
    console.error("Error cargando alumnos:", error);
  }
}

formCrear.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombreAlumno").value;
  const coche = document.getElementById("cocheAlumno").value;

  try {
    await crearAlumno(nombre, coche);

    mensajeCrear.textContent = "Alumno creado correctamente";
    formCrear.reset();

    await cargarAlumnos(); // refresca circuito

  } catch (error) {
    mensajeCrear.textContent = error.message;
  }
});

document.addEventListener("DOMContentLoaded", cargarAlumnos);