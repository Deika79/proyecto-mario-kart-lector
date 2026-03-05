import { obtenerAlumnos, crearAlumno, resetClase } from './api.js';

const token = localStorage.getItem("token");
const rol = localStorage.getItem("rol");

if (!token || rol !== "profesor") {
  window.location.href = "index.html";
}

const form = document.getElementById("crearAlumnoForm");
const mensaje = document.getElementById("mensajeCrear");
const lista = document.getElementById("listaAlumnos");
const resetBtn = document.getElementById("resetClaseBtn");

document.getElementById("volverBtn").onclick = () => {
  window.location.href = "profesor.html";
};

/* ===== CARGAR ALUMNOS ===== */

async function cargarAlumnos() {

  const alumnos = await obtenerAlumnos();

  lista.innerHTML = "";

  alumnos.forEach(alumno => {

    const li = document.createElement("li");

    li.textContent = `${alumno.nombre} — ${alumno.minutosTotales} min`;

    lista.appendChild(li);

  });

}

/* ===== CREAR ALUMNO ===== */

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const nombre = document.getElementById("nombreAlumno").value;
  const coche = document.getElementById("cocheAlumno").value;

  try {

    await crearAlumno(nombre, coche);

    mensaje.textContent = "Alumno creado correctamente";

    form.reset();

    cargarAlumnos();

  } catch (error) {

    mensaje.textContent = error.message;

  }

});

/* ===== RESET CLASE ===== */

resetBtn.addEventListener("click", async () => {

  const confirmar = confirm(
    "Esto borrará TODOS los alumnos y registros de lectura.\n\n¿Seguro que quieres reiniciar la clase?"
  );

  if (!confirmar) return;

  try {

    await resetClase();

    alert("Clase reiniciada correctamente");

    location.reload();

  } catch (error) {

    alert(error.message);

  }

});

/* ===== INICIALIZAR ===== */

cargarAlumnos();