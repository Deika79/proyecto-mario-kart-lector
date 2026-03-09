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
 * 🔵 NUEVO ENDPOINT
 * Obtener alumnos para el circuito (todos los coches)
 */
router.get('/circuito', verificarToken, async (req, res) => {
  try {

    const alumnos = await Alumno.find().select(
      "_id nombre cocheSeleccionado minutosTotales"
    );

    res.json(alumnos);

  } catch (error) {
    res.status(500).json({ error: error.message });
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

    // PADRE → puede tener VARIOS hijos
    if (req.usuario.rol === "padre") {

      const usuario = await Usuario.findById(req.usuario.id);

      if (!usuario || !usuario.alumnosIds || usuario.alumnosIds.length === 0) {
        return res.status(404).json({ error: "Alumno no asociado" });
      }

      const alumnos = await Alumno.find({
        _id: { $in: usuario.alumnosIds }
      });

      return res.json(alumnos);

    }

    return res.status(403).json({ error: "Rol no válido" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
});


/**
 * RESET COMPLETO DE CLASE
 */
router.delete("/reset", verificarToken, async (req, res) => {

  try {

    if (req.usuario.rol !== "profesor") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const RegistroMinutos = (await import('../models/RegistroMinutos.js')).default;

    await Alumno.deleteMany({});
    await RegistroMinutos.deleteMany({});

    res.json({ mensaje: "Clase reiniciada correctamente" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error reiniciando clase" });

  }

});

export default router;