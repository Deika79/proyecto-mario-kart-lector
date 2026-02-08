import express from 'express';
import RegistroMinutos from '../models/RegistroMinutos.js';
import Alumno from '../models/Alumno.js';

const router = express.Router();

/**
 * Registrar minutos de lectura
 */
router.post('/', async (req, res) => {
  try {
    const { alumnoId, minutos } = req.body;

    if (!alumnoId || !minutos) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Crear registro
    const registro = new RegistroMinutos({
      alumnoId,
      minutos,
    });

    await registro.save();

    // Actualizar minutos totales del alumno
    await Alumno.findByIdAndUpdate(alumnoId, {
      $inc: { minutosTotales: minutos },
    });

    res.status(201).json(registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
