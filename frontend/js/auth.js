import { login } from "./api.js";

const form = document.getElementById("loginForm");
const errorMensaje = document.getElementById("errorMensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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