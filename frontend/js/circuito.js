// /js/circuito.js
import { circuito1 } from "./data/circuito1.js";

const MINUTOS_VUELTA = 1920; // 32 horas x 60
const TAMANO_COCHE = 40;
const OFFSET_Y = 10;

export async function pintarCoches(alumnosBackend) {

  const contenedor = document.getElementById('coches-container');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // 🔥 Ahora SOLO usamos lo que venga del backend
  const alumnos = alumnosBackend || [];

  if (!alumnos.length) {
    console.warn("No hay alumnos para pintar.");
    return;
  }

  const totalCasillas = circuito1.length;
  const minutosPorCasilla = MINUTOS_VUELTA / totalCasillas;

  alumnos.forEach(alumno => {

    // Seguridad por si algún campo viene mal
    if (!alumno.minutosTotales) alumno.minutosTotales = 0;

    const progreso = alumno.minutosTotales % MINUTOS_VUELTA;
    const casilla = Math.floor(progreso / minutosPorCasilla);
    alumno.casilla = Math.min(casilla, totalCasillas - 1);

    // 🔥 ASIGNAMOS POSICIÓN (esto faltaba antes)
    const puntoActual = circuito1[alumno.casilla];
    alumno.x = puntoActual.x;
    alumno.y = puntoActual.y;

    // Puntos anterior y siguiente para giro suave
    const puntoAnterior = circuito1[
      (alumno.casilla - 1 + totalCasillas) % totalCasillas
    ];

    const puntoSiguiente = circuito1[
      (alumno.casilla + 1) % totalCasillas
    ];

    // Dirección suavizada
    const dx = puntoSiguiente.x - puntoAnterior.x;
    const dy = puntoSiguiente.y - puntoAnterior.y;

    const anguloRad = Math.atan2(dy, dx);
    let anguloDeg = anguloRad * (180 / Math.PI);

    // 🔥 Ajuste porque el coche mira hacia ARRIBA por defecto
    anguloDeg -= 90;

    alumno.angulo = anguloDeg;
  });

  // Agrupar por casilla (offset si coinciden)
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

  // Pintar coches
  alumnos.forEach(alumno => {

    const img = document.createElement('img');
    img.src = `assets/coches/${alumno.cocheSeleccionado}.png`;
    img.classList.add('coche');
    img.alt = alumno.nombre;

    img.width = TAMANO_COCHE;
    img.height = TAMANO_COCHE;

    img.style.position = "absolute";
    img.style.left = alumno.x + 'px';
    img.style.top = alumno.y + 'px';
    img.style.transform = `rotate(${alumno.angulo}deg)`;
    img.style.transformOrigin = "center center";
    img.style.transition =
      "left 0.4s linear, top 0.4s linear, transform 0.6s ease-out";

    contenedor.appendChild(img);

    // Nombre encima
    const label = document.createElement('div');
    label.textContent = alumno.nombre;
    label.classList.add('nombre-coches');
    label.style.position = "absolute";
    label.style.left = alumno.x + 'px';
    label.style.top = (alumno.y - 20) + 'px';

    contenedor.appendChild(label);
  });
}