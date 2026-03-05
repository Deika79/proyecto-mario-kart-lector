export function pintarRanking(alumnos) {

  const lista = document.getElementById("rankingLista");

  if (!lista) return;

  lista.innerHTML = "";

  const ordenados = [...alumnos].sort(
    (a, b) => b.minutosTotales - a.minutosTotales
  );

  ordenados.forEach((alumno, index) => {

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="ranking-izq">
        <span class="ranking-pos">${index + 1}</span>
        <img class="ranking-coche" src="assets/coches/${alumno.cocheSeleccionado}.png">
        <span class="ranking-nombre">${alumno.nombre}</span>
      </div>
      <span class="ranking-min">${alumno.minutosTotales} min</span>
    `;

    lista.appendChild(li);

  });

}