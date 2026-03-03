import { pintarCoches } from './circuito.js';
import { obtenerAlumnos } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {

  try {
    const alumnos = await obtenerAlumnos();
    console.log("ALUMNOS DESDE BACKEND:", alumnos);

    pintarCoches(alumnos);

  } catch (error) {
    console.error("Error cargando alumnos:", error);
  }

});