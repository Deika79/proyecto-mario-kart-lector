import { obtenerAlumnos, registrarMinutos } from './api.js';

const form = document.getElementById('registroForm');
const alumnoSelect = document.getElementById('alumnoId');
const mensaje = document.getElementById('mensaje');

// Cargar alumnos al cargar la página
async function cargarAlumnos() {
  const alumnos = await obtenerAlumnos();
  alumnoSelect.innerHTML = '';
  alumnos.forEach(alumno => {
    const option = document.createElement('option');
    option.value = alumno._id;
    option.textContent = alumno.nombre;
    alumnoSelect.appendChild(option);
  });
}

// Enviar formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const alumnoId = alumnoSelect.value;
  const minutos = parseInt(document.getElementById('minutos').value);

  if (!alumnoId || !minutos) return;

  const res = await registrarMinutos(alumnoId, minutos);

  if (res.error) {
    mensaje.textContent = `Error: ${res.error}`;
    mensaje.style.color = 'red';
  } else {
    mensaje.textContent = `✅ Minutos registrados correctamente para ${alumnoSelect.selectedOptions[0].text}`;
    mensaje.style.color = 'green';
    form.reset();
  }
});

// Inicializar
cargarAlumnos();
