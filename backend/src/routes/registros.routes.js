import express from 'express';
import Alumno from '../models/Alumno.js';
import RegistroMinutos from '../models/RegistroMinutos.js';

const router = express.Router();

/**
 * POST /api/registros
 * { alumnoId, minutos }
 * Registra minutos para un alumno y actualiza minutosTotales
 */
router.post('/', async (req, res) => {
  try {
    const { alumnoId, minutos } = req.body;
    if (!alumnoId || !minutos) return res.status(400).json({ error: 'Faltan datos' });

    // Crear registro
    const registro = await RegistroMinutos.create({
      alumnoId,
      minutos,
      fecha: new Date()
    });

    // Actualizar total de minutos
    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });

    alumno.minutosTotales += minutos;
    await alumno.save();

    res.json({ ok: true, alumno });
  } catch (error) {
    console.error('Error registrando minutos:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
