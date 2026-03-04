import express from 'express';
import Alumno from '../models/Alumno.js';
import Usuario from '../models/Usuario.js';
import verificarToken from '../middleware/auth.js';

const router = express.Router();

/**
 * Crear alumno (solo profesor)
 */
router.post('/', verificarToken, async (req, res) => {
  try {

    // Solo profesor puede crear alumnos
    if (req.usuario.rol !== "profesor") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const alumno = new Alumno(req.body);
    await alumno.save();

    res.status(201).json(alumno);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Obtener alumnos según rol
 */
router.get('/', verificarToken, async (req, res) => {
  try {

    // PROFESOR → ve todos
    if (req.usuario.rol === "profesor") {
      const alumnos = await Alumno.find();
      return res.json(alumnos);
    }

    // PADRE → solo su hijo
    if (req.usuario.rol === "padre") {

      const usuario = await Usuario.findById(req.usuario.id);

      if (!usuario || !usuario.alumnoId) {
        return res.status(404).json({ error: "Alumno no asociado" });
      }

      const alumno = await Alumno.findById(usuario.alumnoId);

      if (!alumno) {
        return res.status(404).json({ error: "Alumno no encontrado" });
      }

      return res.json([alumno]); // lo devolvemos como array para no romper frontend
    }

    return res.status(403).json({ error: "Rol no válido" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;