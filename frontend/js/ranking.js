export function pintarRanking(alumnos, modoPadre = false, hijosIds = []) {

  const lista = document.getElementById("rankingLista");

  if (!lista) return;

  lista.innerHTML = "";

  const ordenadosPorRanking = [...alumnos].sort(
    (a, b) => b.minutosTotales - a.minutosTotales
  );

  const posicionReal = new Map();

  ordenadosPorRanking.forEach((alumno, index) => {
    posicionReal.set(alumno._id, index + 1);
  });

  const ordenados = modoPadre
    ? [...ordenadosPorRanking].sort((a, b) => {
        const aEsHijo = hijosIds.includes(a._id);
        const bEsHijo = hijosIds.includes(b._id);

        if (aEsHijo === bEsHijo) return 0;

        return aEsHijo ? -1 : 1;
      })
    : ordenadosPorRanking;

  ordenados.forEach((alumno, index) => {

    const li = document.createElement("li");
    const esHijo = modoPadre && hijosIds.includes(alumno._id);

    if (esHijo) {
      li.classList.add("ranking-hijo");
    }

    // 🏁 Calcular vueltas completas
    const vueltas = Math.floor(alumno.minutosTotales / 1920);

    // 🏆 Generar copas por cada vuelta completa
    const copas = "🏆".repeat(vueltas);

    // ⭐ ocultar nombres si es modo padre
    let nombreMostrar = alumno.nombre;

    if (modoPadre && !esHijo) {
      nombreMostrar = "Alumno";
    }

    li.innerHTML = `
      <div class="ranking-izq">
        <span class="ranking-pos">${modoPadre ? posicionReal.get(alumno._id) : index + 1}</span>
        <img class="ranking-coche" src="assets/coches/${alumno.cocheSeleccionado}.png">
        <span class="ranking-nombre">
          ${nombreMostrar}
          ${copas ? `<span class="lap-badges">${copas}</span>` : ""}
        </span>
      </div>
      <span class="ranking-min">${alumno.minutosTotales} min</span>
    `;

    lista.appendChild(li);

  });

}
