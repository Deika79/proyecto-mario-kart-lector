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

/* ===== RANKING ===== */

function pintarRanking(alumnos) {

  const lista = document.getElementById("rankingLista");
  if (!lista) return;

  lista.innerHTML = "";

  const ordenados = [...alumnos].sort(
    (a, b) => b.minutosTotales - a.minutosTotales
  );

  ordenados.forEach((alumno, index) => {

    const li = document.createElement("li");

    let trofeo = "";
    if (index === 0) trofeo = "🥇";
    else if (index === 1) trofeo = "🥈";
    else if (index === 2) trofeo = "🥉";

    li.innerHTML = `
      <div class="ranking-izq">
        <span class="ranking-pos">${trofeo || index + 1}</span>

        <img 
          src="assets/coches/${alumno.cocheSeleccionado}.png" 
          class="ranking-coche"
        >

        <span class="ranking-nombre">${alumno.nombre}</span>
      </div>

      <span class="ranking-min">${alumno.minutosTotales} min</span>
    `;

    lista.appendChild(li);

  });

}

/* ===== CARGAR DATOS ===== */

document.addEventListener('DOMContentLoaded', async () => {

  try {

    const alumnos = await obtenerAlumnos();

    console.log("ALUMNOS DESDE BACKEND:", alumnos);

    pintarCoches(alumnos);

    pintarRanking(alumnos);

  } catch (error) {

    console.error("Error cargando alumnos:", error);

  }

});