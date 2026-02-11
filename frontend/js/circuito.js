// circuito.js
// Lógica para pintar los coches en el circuito

// Si quieres usar backend después, reemplaza 'alumnos' por obtenerPosiciones()
export async function pintarCoches() {
  const contenedor = document.getElementById('coches-container');
  if (!contenedor) return; // seguridad

  contenedor.innerHTML = ''; // limpiar contenedor

  // MOCK de prueba: un alumno
  const alumnos = [
    { nombre: "Mario", cocheSeleccionado: "coche1", x: 200, y: 150, casilla: 1 }
  ];

  console.log('ALUMNOS MOCK:', alumnos);

  // Agrupar por casilla y aplicar offset vertical
  const agrupados = {};
  alumnos.forEach((p) => {
    if (!agrupados[p.casilla]) agrupados[p.casilla] = [];
    agrupados[p.casilla].push(p);
  });

  Object.values(agrupados).forEach((grupo) => {
    grupo.forEach((p, index) => {
      p.y += index * 8; // separa coches en la misma casilla
    });
  });

  // Pintar cada coche
  alumnos.forEach((alumno) => {
    const img = document.createElement('img');
    img.src = `assets/coches/${alumno.cocheSeleccionado}.png`;
    img.classList.add('coche');
    img.alt = alumno.nombre;

    // Forzar tamaño aunque la imagen original sea gigante
    img.width = 40;
    img.height = 40;

    // Posición absoluta en el contenedor
    img.style.left = alumno.x + 'px';
    img.style.top = alumno.y + 'px';

    contenedor.appendChild(img);

    // Etiqueta con el nombre encima del coche
    const label = document.createElement('div');
    label.textContent = alumno.nombre;
    label.classList.add('nombre-coches');
    label.style.left = alumno.x + 'px';
    label.style.top = (alumno.y - 20) + 'px';

    contenedor.appendChild(label);
  });
}
