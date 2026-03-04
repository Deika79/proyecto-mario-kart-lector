import express from 'express';
import Alumno from '../models/Alumno.js';
import RegistroMinutos from '../models/RegistroMinutos.js';
import Usuario from '../models/Usuario.js';
import verificarToken from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/registros
 * { alumnoId, minutos }
 * Registra minutos para un alumno según rol
 */
router.post('/', verificarToken, async (req, res) => {
  try {
    const { alumnoId, minutos } = req.body;

    if (!alumnoId || !minutos) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    // Buscar alumno
    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    // 🔐 CONTROL POR ROL

    // Si es PADRE → solo puede registrar a su hijo
    if (req.usuario.rol === "padre") {
      const usuario = await Usuario.findById(req.usuario.id);

      if (!usuario || !usuario.alumnoId) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      if (usuario.alumnoId.toString() !== alumnoId) {
        return res.status(403).json({ error: 'No puedes registrar minutos a este alumno' });
      }
    }

    // PROFESOR puede registrar a cualquiera (no hace falta validar más)

    // Crear registro
    const registro = await RegistroMinutos.create({
      alumnoId,
      minutos,
      fecha: new Date()
    });

    // Actualizar minutos totales
    alumno.minutosTotales += minutos;
    await alumno.save();

    res.json({ ok: true, alumno });

  } catch (error) {
    console.error('Error registrando minutos:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;