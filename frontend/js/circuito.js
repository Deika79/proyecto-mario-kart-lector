// js/circuito.js

import { circuito1 } from "./data/circuito1.js";

const MINUTOS_VUELTA = 1920;

export async function pintarCoches() {
  const contenedor = document.getElementById('coches-container');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // 🔹 MOCK temporal (luego vendrá del backend)
  const alumnos = [
    { nombre: "Mario", cocheSeleccionado: "coche1", minutosTotales: 0 },
    { nombre: "Luigi", cocheSeleccionado: "coche2", minutosTotales: 0 }
  ];

  const totalCasillas = circuito1.length;
  const minutosPorCasilla = MINUTOS_VUELTA / totalCasillas;

  // Calcular casilla real
  alumnos.forEach(alumno => {
    const progreso = alumno.minutosTotales % MINUTOS_VUELTA;
    const casilla = Math.floor(progreso / minutosPorCasilla);
    alumno.casilla = Math.min(casilla, totalCasillas - 1);

    const punto = circuito1[alumno.casilla];
    alumno.x = punto.x;
    alumno.y = punto.y;
  });

  // Agrupar por casilla (offset si coinciden)
  const agrupados = {};
  alumnos.forEach(p => {
    if (!agrupados[p.casilla]) agrupados[p.casilla] = [];
    agrupados[p.casilla].push(p);
  });

  Object.values(agrupados).forEach(grupo => {
    grupo.forEach((p, index) => {
      p.y += index * 10;
    });
  });

  // Pintar coches
  alumnos.forEach(alumno => {
    const img = document.createElement('img');
    img.src = `assets/coches/${alumno.cocheSeleccionado}.png`;
    img.classList.add('coche');
    img.alt = alumno.nombre;

    img.width = 40;
    img.height = 40;

    img.style.position = "absolute";
    img.style.left = alumno.x + 'px';
    img.style.top = alumno.y + 'px';

    contenedor.appendChild(img);

    const label = document.createElement('div');
    label.textContent = alumno.nombre;
    label.classList.add('nombre-coches');
    label.style.position = "absolute";
    label.style.left = alumno.x + 'px';
    label.style.top = (alumno.y - 20) + 'px';

    contenedor.appendChild(label);
  });
}