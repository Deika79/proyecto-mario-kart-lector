import express from 'express';
import Alumno from '../models/Alumno.js';

const router = express.Router();

/**
 * Crear alumno
 */
router.post('/', async (req, res) => {
  try {
    const alumno = new Alumno(req.body);
    await alumno.save();
    res.status(201).json(alumno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Obtener todos los alumnos
 */
router.get('/', async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
