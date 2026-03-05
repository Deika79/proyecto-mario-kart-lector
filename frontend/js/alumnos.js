import { obtenerAlumnos, crearAlumno, resetClase, crearPadre, obtenerUsuarios } from './api.js';

/* =========================
   GENERAR PASSWORD
========================= */

function generarPassword() {
  const numero = Math.floor(1000 + Math.random() * 9000);
  return `lectura-${numero}`;
}

/* =========================
   CONTROL LOGIN
========================= */

const token = localStorage.getItem("token");
const rol = localStorage.getItem("rol");

if (!token || rol !== "profesor") {
  window.location.href = "index.html";
}

/* =========================
   ELEMENTOS DOM
========================= */

const form = document.getElementById("crearAlumnoForm");
const mensaje = document.getElementById("mensajeCrear");
const lista = document.getElementById("listaAlumnos");

const modal = document.getElementById("modalPadre");
const padreForm = document.getElementById("crearPadreForm");

const passwordInput = document.getElementById("padrePassword");
const passwordTexto = document.getElementById("passwordGenerada");

/* =========================
   BOTÓN VOLVER
========================= */

document.getElementById("volverBtn").onclick = () => {
  window.location.href = "profesor.html";
};

/* =========================
   CARGAR ALUMNOS
========================= */

async function cargarAlumnos() {

  const alumnos = await obtenerAlumnos();
  const usuarios = await obtenerUsuarios();

  lista.innerHTML = "";

  alumnos.forEach(alumno => {

    const padreExiste = usuarios.some(
      u => u.rol === "padre" && u.alumnoId === alumno._id
    );

    const estadoPadre = padreExiste
      ? "Padre creado ✅"
      : "Padre pendiente ❌";

    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${alumno.nombre}</strong> — ${alumno.minutosTotales} min
      <br>
      <small>${estadoPadre}</small>
      <br>
      <button class="crearPadreBtn" data-id="${alumno._id}">
        Crear usuario padre
      </button>
      <br><br>
    `;

    lista.appendChild(li);

  });

  document.querySelectorAll(".crearPadreBtn").forEach(btn => {

    btn.addEventListener("click", () => {

      document.getElementById("padreAlumnoId").value = btn.dataset.id;

      const password = generarPassword();

      passwordInput.value = password;

      passwordTexto.textContent = `Password generada: ${password}`;

      modal.style.display = "block";

    });

  });

}

/* =========================
   CREAR ALUMNO
========================= */

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const nombre = document.getElementById("nombreAlumno").value;
  const coche = document.getElementById("cocheAlumno").value;

  try {

    await crearAlumno(nombre, coche);

    mensaje.textContent = "Alumno creado correctamente";

    form.reset();

    cargarAlumnos();

  } catch (error) {

    mensaje.textContent = error.message;

  }

});

/* =========================
   CREAR PADRE
========================= */

padreForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const alumnoId = document.getElementById("padreAlumnoId").value;
  const nombre = document.getElementById("padreNombre").value;
  const email = document.getElementById("padreEmail").value;
  const password = passwordInput.value;

  try {

    await crearPadre(nombre, email, password, alumnoId);

    document.getElementById("mensajePadre").textContent = "Usuario padre creado";

    padreForm.reset();

    modal.style.display = "none";

    cargarAlumnos();

  } catch (error) {

    document.getElementById("mensajePadre").textContent = error.message;

  }

});

/* =========================
   CUANDO CARGA LA PÁGINA
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const btnGenerar = document.getElementById("generarPasswordBtn");
  const btnCopiar = document.getElementById("copiarPasswordBtn");

  if (btnGenerar) {

    btnGenerar.addEventListener("click", () => {

      const password = generarPassword();

      passwordInput.value = password;

      passwordTexto.textContent = `Password generada: ${password}`;

    });

  }

  if (btnCopiar) {

    btnCopiar.addEventListener("click", () => {

      const password = passwordInput.value;

      navigator.clipboard.writeText(password);

      alert("Contraseña copiada");

    });

  }

});

/* =========================
   CERRAR MODAL
========================= */

document.getElementById("cancelarPadre").onclick = () => {
  modal.style.display = "none";
};

/* =========================
   RESET CLASE
========================= */

document.getElementById("resetClaseBtn").addEventListener("click", async () => {

  const confirmar = confirm(
    "Esto borrará TODOS los alumnos y registros.\n\n¿Seguro?"
  );

  if (!confirmar) return;

  try {

    await resetClase();

    alert("Clase reiniciada");

    location.reload();

  } catch (error) {

    alert(error.message);

  }

});

/* =========================
   INICIAR
========================= */

cargarAlumnos();