// /js/circuito.js
import { circuito1 } from "./data/circuito1.js";

const MINUTOS_VUELTA = 1920;
const TAMANO_COCHE_MAX = 40;
const TAMANO_COCHE_MIN = 18;

let ultimoEstado = null;

function normalizarHijos(hijos) {
  if (!hijos) return [];
  return Array.isArray(hijos) ? hijos : [hijos];
}

function calcularTamanoCoche(anchoCircuito) {
  return Math.max(
    TAMANO_COCHE_MIN,
    Math.min(TAMANO_COCHE_MAX, Math.round(anchoCircuito / 18))
  );
}

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

export function pintarCoches(alumnosBackend, modoPadre = false, hijos = null) {

  const contenedor = document.getElementById("coches-container");
  const circuitoImg = document.getElementById("circuito");

  if (!contenedor || !circuitoImg) return;

  // esperar a que cargue la imagen (clave para móvil)
  if (!circuitoImg.complete) {
    circuitoImg.onload = () => pintarCoches(alumnosBackend, modoPadre, hijoId);
    return;
  }

  contenedor.innerHTML = "";

  const alumnos = alumnosBackend || [];
  if (!alumnos.length) return;

  const hijosIds = normalizarHijos(hijos);
  ultimoEstado = { alumnosBackend, modoPadre, hijos: hijosIds };

  const totalCasillas = circuito1.length;
  const minutosPorCasilla = MINUTOS_VUELTA / totalCasillas;

  const anchoOriginal = circuitoImg.naturalWidth || 900;
  const altoOriginal = circuitoImg.naturalHeight || 900;
  const anchoVisible = circuitoImg.offsetWidth;
  const escala = anchoVisible / anchoOriginal;
  const tamanoCoche = calcularTamanoCoche(anchoVisible);
  const offsetStack = Math.max(5, Math.round(tamanoCoche * 0.3 / escala));

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

      // evitar solapamientos con separación proporcional al tamaño visible
      offsetY += index * offsetStack;

      const margenOriginal = (tamanoCoche / 2 + 2) / escala;
      const x = limitar(
        punto.x + offsetX,
        margenOriginal,
        anchoOriginal - margenOriginal
      );
      const y = limitar(
        punto.y + offsetY,
        margenOriginal,
        altoOriginal - margenOriginal
      );

      const puntoAnterior =
        circuito1[(alumno.casilla - 1 + totalCasillas) % totalCasillas];

      const puntoSiguiente =
        circuito1[(alumno.casilla + 1) % totalCasillas];

      const dx = puntoSiguiente.x - puntoAnterior.x;
      const dy = puntoSiguiente.y - puntoAnterior.y;

      let angulo = Math.atan2(dy, dx) * (180 / Math.PI);
      angulo -= 90;

      const left = (x / anchoOriginal) * 100;
      const top = (y / altoOriginal) * 100;
      const esHijo = hijosIds.includes(alumno._id);

      const img = document.createElement("img");
      img.src = `assets/coches/${alumno.cocheSeleccionado}.png`;
      img.classList.add("coche");

      if (modoPadre && esHijo) {
        img.classList.add("coche-hijo");
      }

      if (modoPadre && !esHijo) {
        img.classList.add("coche-rival");
      }

      img.width = tamanoCoche;
      img.height = tamanoCoche;

      img.style.position = "absolute";
      img.style.left = left + "%";
      img.style.top = top + "%";
      img.style.transform = `translate(-50%, -50%) rotate(${angulo}deg)`;

      contenedor.appendChild(img);

      const label = document.createElement("div");

      if (!modoPadre || esHijo) {
        label.textContent = alumno.nombre;
      }

      label.classList.add("nombre-coches");
      if (modoPadre && esHijo) {
        label.classList.add("nombre-hijo");
      }
      label.style.position = "absolute";
      label.style.left = left + "%";
      label.style.top = `calc(${top}% - ${Math.max(14, tamanoCoche * 0.8)}px)`;

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
    ultimoEstado.hijos
  );

});
