export function pintarRanking(alumnos, modoPadre = false, hijoId = null) {

  const lista = document.getElementById("rankingLista");

  if (!lista) return;

  lista.innerHTML = "";

  const ordenados = [...alumnos].sort(
    (a, b) => b.minutosTotales - a.minutosTotales
  );

  ordenados.forEach((alumno, index) => {

    const li = document.createElement("li");

    // 🏁 Calcular vueltas completas
    const vueltas = Math.floor(alumno.minutosTotales / 1920);

    // 🏅 Generar medallas
    const medallas = "🏅".repeat(vueltas);

    // ⭐ ocultar nombres si es modo padre
    let nombreMostrar = alumno.nombre;

    if (modoPadre && alumno._id !== hijoId) {
      nombreMostrar = "Alumno";
    }

    li.innerHTML = `
      <div class="ranking-izq">
        <span class="ranking-pos">${index + 1}</span>
        <img class="ranking-coche" src="assets/coches/${alumno.cocheSeleccionado}.png">
        <span class="ranking-nombre">${nombreMostrar}</span>
      </div>
      <span class="ranking-min">${medallas} ${alumno.minutosTotales} min</span>
    `;

    lista.appendChild(li);

  });

}