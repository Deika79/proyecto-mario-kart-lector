import { obtenerPosiciones } from './api.js';

export async function pintarCoches() {
  const contenedor = document.getElementById('coches-container');
  contenedor.innerHTML = ''; // limpiar

  const alumnos = await obtenerPosiciones();

  alumnos.forEach((alumno) => {
    const img = document.createElement('img');
    img.src = `assets/coches/${alumno.coche}.png`;
    img.classList.add('coche');
    img.style.left = alumno.x + 'px';
    img.style.top = alumno.y + 'px';
    contenedor.appendChild(img);

    const label = document.createElement('div');
    label.textContent = alumno.nombre;
    label.classList.add('nombre-coches');
    label.style.left = alumno.x + 'px';
    label.style.top = (alumno.y - 20) + 'px';
    contenedor.appendChild(label);
  });
}
