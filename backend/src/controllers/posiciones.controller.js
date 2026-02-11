// posiciones.controller.js (Mock para pruebas)
import Alumno from '../models/alumno.model.js';

// Configuración del circuito (coordenadas de ejemplo)
const COORDENADAS_CASILLAS = [
  { x: 100, y: 100 },
  { x: 200, y: 100 },
  { x: 300, y: 100 },
  { x: 400, y: 150 },
  { x: 500, y: 200 },
  { x: 600, y: 250 },
  { x: 700, y: 300 },
  { x: 750, y: 350 },
  // ... añade tantas coordenadas como casillas necesites
];

export const obtenerPosiciones = async (req, res) => {
  try {
    // MOCK de alumnos para pruebas locales
    const alumnos = [
      { nombre: "Mario", cocheSeleccionado: "coche1", minutosTotales: 25, claseId: "1A" },
      { nombre: "Luigi", cocheSeleccionado: "coche2", minutosTotales: 40, claseId: "1A" },
      { nombre: "Peach", cocheSeleccionado: "coche3", minutosTotales: 15, claseId: "1A" }
    ];

    // Calcular casilla y coordenadas
    const CASILLA_MINUTOS = 10; // 10 minutos = 1 casilla
    const posiciones = alumnos.map(alumno => {
      const casilla = Math.floor(alumno.minutosTotales / CASILLA_MINUTOS);
      const coords = COORDENADAS_CASILLAS[casilla] || COORDENADAS_CASILLAS[COORDENADAS_CASILLAS.length - 1];

      return {
        nombre: alumno.nombre,
        cocheSeleccionado: alumno.cocheSeleccionado,
        x: coords.x,
        y: coords.y,
        casilla
      };
    });

    // Agrupar por casilla y aplicar offset vertical
    const agrupados = {};
    posiciones.forEach(p => {
      if (!agrupados[p.casilla]) agrupados[p.casilla] = [];
      agrupados[p.casilla].push(p);
    });
    Object.values(agrupados).forEach(grupo => {
      grupo.forEach((p, index) => {
        p.y += index * 8;
      });
    });

    res.json(posiciones);
  } catch (error) {
    console.error('Error obteniendo posiciones (mock):', error);
    res.status(500).json({ error: 'Error al obtener posiciones' });
  }
};
