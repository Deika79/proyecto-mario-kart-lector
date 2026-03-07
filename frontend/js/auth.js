import { login } from "./api.js";
import { despertarBackend } from "./api.js";

despertarBackend();

const form = document.getElementById("loginForm");
const errorMensaje = document.getElementById("errorMensaje");

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

/* 👁️ Mostrar / ocultar contraseña */

if (togglePassword) {

  togglePassword.addEventListener("click", () => {

    const tipo =
      passwordInput.getAttribute("type") === "password"
        ? "text"
        : "password";

    passwordInput.setAttribute("type", tipo);

    togglePassword.textContent = tipo === "password" ? "👁️" : "🙈";

  });

}


/* LOGIN */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = passwordInput.value;

  try {

    const data = await login(email, password);

    // Guardar token y rol
    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.rol);

    // Redirigir según rol
    if (data.rol === "profesor") {
      window.location.href = "profesor.html";
    } else {
      window.location.href = "padre.html";
    }

  } catch (error) {

    errorMensaje.textContent = error.message;

  }

});