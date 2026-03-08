// /js/circuito.js
import { circuito1 } from "./data/circuito1.js";

const MINUTOS_VUELTA = 1920;
const TAMANO_COCHE = 40;
const OFFSET_Y = 10;

export async function pintarCoches(alumnosBackend, modoPadre = false, hijoId = null) {

  const contenedor = document.getElementById('coches-container');
  const circuitoImg = document.getElementById('circuito');

  if (!contenedor || !circuitoImg) return;

  contenedor.innerHTML = '';

  const alumnos = alumnosBackend || [];

  if (!alumnos.length) {
    console.warn("No hay alumnos para pintar.");
    return;
  }

  const totalCasillas = circuito1.length;
  const minutosPorCasilla = MINUTOS_VUELTA / totalCasillas;

  const anchoCircuito = circuitoImg.clientWidth;
  const altoCircuito = circuitoImg.clientHeight;

  alumnos.forEach(alumno => {

    if (!alumno.minutosTotales) alumno.minutosTotales = 0;

    const progreso = alumno.minutosTotales % MINUTOS_VUELTA;
    const casilla = Math.floor(progreso / minutosPorCasilla);
    alumno.casilla = Math.min(casilla, totalCasillas - 1);

    const puntoActual = circuito1[alumno.casilla];

    let offsetX = 0;
    let offsetY = 0;

    // 🏁 PARRILLA 8 COCHES (4 filas)

    switch (alumno.cocheSeleccionado) {

      case "coche1":
        offsetX = -45;
        offsetY = -60;
        break;

      case "coche2":
        offsetX = -20;
        offsetY = -60;
        break;

      case "coche3":
        offsetX = -45;
        offsetY = -30;
        break;

      case "coche4":
        offsetX = -20;
        offsetY = -30;
        break;

      case "coche5":
        offsetX = -45;
        offsetY = 0;
        break;

      case "coche6":
        offsetX = -20;
        offsetY = 0;
        break;

      case "coche7":
        offsetX = -45;
        offsetY = 30;
        break;

      case "coche8":
        offsetX = -20;
        offsetY = 30;
        break;

    }

    alumno.x = puntoActual.x + offsetX;
    alumno.y = puntoActual.y + offsetY;

    const puntoAnterior = circuito1[
      (alumno.casilla - 1 + totalCasillas) % totalCasillas
    ];

    const puntoSiguiente = circuito1[
      (alumno.casilla + 1) % totalCasillas
    ];

    const dx = puntoSiguiente.x - puntoAnterior.x;
    const dy = puntoSiguiente.y - puntoAnterior.y;

    const anguloRad = Math.atan2(dy, dx);
    let anguloDeg = anguloRad * (180 / Math.PI);

    anguloDeg -= 90;

    alumno.angulo = anguloDeg;

  });

  const agrupados = {};

  alumnos.forEach(p => {
    if (!agrupados[p.casilla]) agrupados[p.casilla] = [];
    agrupados[p.casilla].push(p);
  });

  Object.values(agrupados).forEach(grupo => {
    grupo.forEach((p, index) => {
      p.y += index * OFFSET_Y;
    });
  });

  alumnos.forEach(alumno => {

    const img = document.createElement('img');
    img.src = `assets/coches/${alumno.cocheSeleccionado}.png`;
    img.classList.add('coche');

    if (modoPadre && alumno._id === hijoId) {
      img.classList.add('coche-hijo');
    }

    img.alt = alumno.nombre;
    img.width = TAMANO_COCHE;
    img.height = TAMANO_COCHE;

    // ⭐ POSICIÓN RESPONSIVE
    const leftPercent = (alumno.x / anchoCircuito) * 100;
    const topPercent = (alumno.y / altoCircuito) * 100;

    img.style.position = "absolute";
    img.style.left = leftPercent + "%";
    img.style.top = topPercent + "%";
    img.style.transform = `rotate(${alumno.angulo}deg)`;
    img.style.transformOrigin = "center center";

    contenedor.appendChild(img);

    const label = document.createElement('div');

    if (!modoPadre || alumno._id === hijoId) {
      label.textContent = alumno.nombre;
    }

    label.classList.add('nombre-coches');
    label.style.position = "absolute";
    label.style.left = leftPercent + "%";
    label.style.top = (topPercent - 3) + "%";

    contenedor.appendChild(label);

  });

}