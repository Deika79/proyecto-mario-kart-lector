import express from 'express';
import Alumno from '../models/Alumno.js';
import verificarToken from '../middleware/auth.js';

const router = express.Router();

/**
 * Crear alumno (protegido)
 */
router.post('/', verificarToken, async (req, res) => {
  try {
    const alumno = new Alumno(req.body);
    await alumno.save();
    res.status(201).json(alumno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Obtener todos los alumnos (protegido)
 */
router.get('/', verificarToken, async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;