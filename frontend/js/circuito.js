// /js/circuito.js
import { circuito1 } from "./data/circuito1.js";

const MINUTOS_VUELTA = 1920;
const TAMANO_COCHE = 40;

// separación entre coches en misma casilla
const OFFSET_STACK = 12;

// tamaño base del circuito (imagen original)
const BASE_WIDTH = 900;
const BASE_HEIGHT = 600;

let ultimoEstado = null;

export function pintarCoches(alumnosBackend, modoPadre = false, hijoId = null) {

  const contenedor = document.getElementById("coches-container");
  const circuitoImg = document.getElementById("circuito");

  if (!contenedor || !circuitoImg) return;

  // esperar carga de imagen (importante en móvil)
  if (!circuitoImg.complete) {
    circuitoImg.onload = () => pintarCoches(alumnosBackend, modoPadre, hijoId);
    return;
  }

  contenedor.innerHTML = "";

  const alumnos = alumnosBackend || [];
  if (!alumnos.length) return;

  ultimoEstado = { alumnosBackend, modoPadre, hijoId };

  const totalCasillas = circuito1.length;
  const minutosPorCasilla = MINUTOS_VUELTA / totalCasillas;

  const ancho = circuitoImg.offsetWidth;
  const alto = circuitoImg.offsetHeight;

  const scaleX = ancho / BASE_WIDTH;
  const scaleY = alto / BASE_HEIGHT;

  // agrupar coches por casilla (para evitar solapamientos)
  const agrupados = {};

  alumnos.forEach(alumno => {

    const minutos = alumno.minutosTotales || 0;

    const progreso = minutos % MINUTOS_VUELTA;
    const casilla = Math.floor(progreso / minutosPorCasilla);

    alumno.casilla = Math.min(casilla, totalCasillas - 1);

    if (!agrupados[alumno.casilla]) {
      agrupados[alumno.casilla] = [];
    }

    agrupados[alumno.casilla].push(alumno);

  });

  Object.values(agrupados).forEach(grupo => {

    grupo.forEach((alumno, index) => {

      const punto = circuito1[alumno.casilla];

      let offsetX = 0;
      let offsetY = 0;

      // parrilla de salida
      if (alumno.casilla === 0) {

        const parrilla = {
          coche1: [-45,-60],
          coche2: [-20,-60],
          coche3: [-45,-30],
          coche4: [-20,-30],
          coche5: [-45,0],
          coche6: [-20,0],
          coche7: [-45,30],
          coche8: [-20,30]
        };

        if (parrilla[alumno.cocheSeleccionado]) {
          offsetX = parrilla[alumno.cocheSeleccionado][0];
          offsetY = parrilla[alumno.cocheSeleccionado][1];
        }

      }

      // evitar solapamientos
      offsetY += index * OFFSET_STACK;

      const x = (punto.x + offsetX) * scaleX;
      const y = (punto.y + offsetY) * scaleY;

      const puntoAnterior =
        circuito1[(alumno.casilla - 1 + totalCasillas) % totalCasillas];

      const puntoSiguiente =
        circuito1[(alumno.casilla + 1) % totalCasillas];

      const dx = puntoSiguiente.x - puntoAnterior.x;
      const dy = puntoSiguiente.y - puntoAnterior.y;

      let angulo = Math.atan2(dy, dx) * (180 / Math.PI);
      angulo -= 90;

      const left = (x / ancho) * 100;
      const top = (y / alto) * 100;

      const img = document.createElement("img");
      img.src = `assets/coches/${alumno.cocheSeleccionado}.png`;
      img.classList.add("coche");

      if (modoPadre && alumno._id === hijoId) {
        img.classList.add("coche-hijo");
      }

      img.width = TAMANO_COCHE;
      img.height = TAMANO_COCHE;

      img.style.position = "absolute";
      img.style.left = left + "%";
      img.style.top = top + "%";
      img.style.transform = `rotate(${angulo}deg)`;

      contenedor.appendChild(img);

      const label = document.createElement("div");

      if (!modoPadre || alumno._id === hijoId) {
        label.textContent = alumno.nombre;
      }

      label.classList.add("nombre-coches");
      label.style.position = "absolute";
      label.style.left = left + "%";
      label.style.top = (top - 3) + "%";

      contenedor.appendChild(label);

    });

  });

}

// recalcular posiciones si cambia tamaño (rotación móvil)
window.addEventListener("resize", () => {

  if (!ultimoEstado) return;

  pintarCoches(
    ultimoEstado.alumnosBackend,
    ultimoEstado.modoPadre,
    ultimoEstado.hijoId
  );

});