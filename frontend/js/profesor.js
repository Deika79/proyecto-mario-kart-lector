import { pintarCoches } from './circuito.js';
import { obtenerAlumnos } from './api.js';

const token = localStorage.getItem("token");
const rol = localStorage.getItem("rol");

if (!token || rol !== "profesor") {
  window.location.href = "index.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  window.location.href = "index.html";
});

document.addEventListener('DOMContentLoaded', async () => {

  try {
    const alumnos = await obtenerAlumnos();
    console.log("ALUMNOS DESDE BACKEND:", alumnos);

    pintarCoches(alumnos);

  } catch (error) {
    console.error("Error cargando alumnos:", error);
  }

});