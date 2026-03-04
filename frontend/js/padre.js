import { obtenerAlumnos, registrarMinutos } from './api.js';

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

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  window.location.href = "index.html";
});

// Cargar alumnos (solo traerá el suyo)
async function cargarAlumnos() {
  const alumnos = await obtenerAlumnos();

  alumnoSelect.innerHTML = '';

  alumnos.forEach(alumno => {
    const option = document.createElement('option');
    option.value = alumno._id;
    option.textContent = alumno.nombre;
    alumnoSelect.appendChild(option);
  });
}

// Enviar formulario
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

  } catch (error) {
    mensaje.textContent = error.message;
  }
});

// Inicializar
cargarAlumnos();