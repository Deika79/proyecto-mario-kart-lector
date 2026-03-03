const container = document.getElementById("circuito-container");

let puntos = [];

container.addEventListener("click", function (e) {
  const rect = container.getBoundingClientRect();

  const x = Math.round(e.clientX - rect.left);
  const y = Math.round(e.clientY - rect.top);

  const punto = { x, y };
  puntos.push(punto);

  dibujarPunto(x, y);

  console.clear();
  console.log(JSON.stringify(puntos, null, 2));
});

function dibujarPunto(x, y) {
  const puntoDiv = document.createElement("div");

  puntoDiv.style.position = "absolute";
  puntoDiv.style.left = x + "px";
  puntoDiv.style.top = y + "px";
  puntoDiv.style.width = "8px";
  puntoDiv.style.height = "8px";
  puntoDiv.style.background = "red";
  puntoDiv.style.borderRadius = "50%";
  puntoDiv.style.transform = "translate(-50%, -50%)";
  puntoDiv.style.pointerEvents = "none";

  container.appendChild(puntoDiv);
}