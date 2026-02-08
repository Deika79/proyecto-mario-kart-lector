const form = document.getElementById('loginForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const rol = document.getElementById('rol').value;

  // Guardamos en localStorage para simular sesión
  localStorage.setItem('usuario', usuario);
  localStorage.setItem('rol', rol);

  if (rol === 'profesor') {
    window.location.href = 'profesor.html';
  } else {
    window.location.href = 'padre.html';
  }
});
