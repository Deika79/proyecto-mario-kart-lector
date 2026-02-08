import express from 'express';
import Alumno from '../models/Alumno.js';
import { circuito } from '../data/circuito.js';

const router = express.Router();

// Constante: 32 horas = 1 vuelta completa
const MINUTOS_POR_VUELTA = 32 * 60; // 1920

/**
 * GET /api/posiciones
 * Devuelve la posición de todos los alumnos en coordenadas del circuito
 */
router.get('/', async (req, res) => {
  try {
    const alumnos = await Alumno.find();

    // Calcula la casilla y coordenadas de cada alumno
    const posiciones = alumnos.map((alumno) => {
      const progreso = alumno.minutosTotales / MINUTOS_POR_VUELTA;
      const indice = Math.floor(progreso * circuito.length);

      const casilla = Math.min(indice, circuito.length - 1);
      const coords = { ...circuito[casilla] }; // copiar objeto

      return {
        alumnoId: alumno._id,
        nombre: alumno.nombre,
        coche: alumno.cocheSeleccionado,
        minutos: alumno.minutosTotales,
        casilla,
        x: coords.x,
        y: coords.y,
      };
    });

    // 🔹 Agrupar alumnos por casilla y aplicar offset vertical
    const agrupados = {};

    posiciones.forEach((p) => {
      if (!agrupados[p.casilla]) agrupados[p.casilla] = [];
      agrupados[p.casilla].push(p);
    });

    Object.values(agrupados).forEach((grupo) => {
      grupo.forEach((p, index) => {
        p.y += index * 8; // offset vertical 8px
      });
    });

    res.json(posiciones);
  } catch (error) {
    console.error('Error en /api/posiciones:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
