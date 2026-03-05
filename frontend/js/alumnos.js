import { obtenerAlumnos, crearAlumno } from './api.js';

const token = localStorage.getItem("token");
const rol = localStorage.getItem("rol");

if (!token || rol !== "profesor") {
  window.location.href = "index.html";
}

const form = document.getElementById("crearAlumnoForm");
const mensaje = document.getElementById("mensajeCrear");
const lista = document.getElementById("listaAlumnos");

document.getElementById("volverBtn").onclick = () => {
  window.location.href = "profesor.html";
};

async function cargarAlumnos() {

  const alumnos = await obtenerAlumnos();

  lista.innerHTML = "";

  alumnos.forEach(a => {

    const li = document.createElement("li");

    li.textContent = `${a.nombre} — ${a.minutosTotales} min`;

    lista.appendChild(li);

  });

}

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

cargarAlumnos();