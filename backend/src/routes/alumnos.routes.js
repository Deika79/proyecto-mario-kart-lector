import express from 'express';
import Alumno from '../models/Alumno.js';
import Usuario from '../models/Usuario.js';
import RegistroMinutos from '../models/RegistroMinutos.js';
import CursoArchivado from '../models/CursoArchivado.js';
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
 * Obtener cursos archivados (solo profesor)
 */
router.get('/archivos', verificarToken, async (req, res) => {

  try {

    if (req.usuario.rol !== "profesor") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const archivos = await CursoArchivado.find()
      .select("_id nombre createdAt alumnos.nombre alumnos.minutosTotales")
      .sort({ createdAt: -1 });

    res.json(archivos);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/**
 * ARCHIVAR CURSO Y REINICIAR PUNTOS
 * Conserva alumnos, padres, usuarios y passwords.
 */
router.post('/archivar-reiniciar', verificarToken, async (req, res) => {

  try {

    if (req.usuario.rol !== "profesor") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const nombre = (req.body.nombre || "").trim();

    if (!nombre) {
      return res.status(400).json({ error: "Indica un nombre para el curso archivado" });
    }

    const alumnos = await Alumno.find().sort({ nombre: 1 });
    const registros = await RegistroMinutos.find({
      alumnoId: { $in: alumnos.map(alumno => alumno._id) }
    }).sort({ fecha: 1 });
    const padres = await Usuario.find({ rol: "padre" }).select("_id nombre email alumnosIds");

    const registrosPorAlumno = registros.reduce((mapa, registro) => {
      const alumnoId = registro.alumnoId.toString();

      if (!mapa.has(alumnoId)) {
        mapa.set(alumnoId, []);
      }

      mapa.get(alumnoId).push({
        minutos: registro.minutos,
        fecha: registro.fecha,
      });

      return mapa;
    }, new Map());

    const archivo = await CursoArchivado.create({
      nombre,
      alumnos: alumnos.map(alumno => ({
        alumnoIdOriginal: alumno._id,
        nombre: alumno.nombre,
        cocheSeleccionado: alumno.cocheSeleccionado,
        minutosTotales: alumno.minutosTotales,
        registros: registrosPorAlumno.get(alumno._id.toString()) || [],
      })),
      padres: padres.map(padre => ({
        usuarioIdOriginal: padre._id,
        nombre: padre.nombre,
        email: padre.email,
        alumnosIdsOriginales: padre.alumnosIds,
      })),
    });

    await Alumno.updateMany({}, { $set: { minutosTotales: 0 } });
    await RegistroMinutos.deleteMany({
      alumnoId: { $in: alumnos.map(alumno => alumno._id) }
    });

    res.json({
      mensaje: "Curso archivado y clase reiniciada correctamente",
      archivo,
      alumnosReiniciados: alumnos.length,
    });

  } catch (error) {

    console.error("Error archivando y reiniciando curso:", error);
    res.status(500).json({ error: "Error archivando y reiniciando curso" });

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

    await Alumno.deleteMany({});
    await RegistroMinutos.deleteMany({});
    await Usuario.deleteMany({ rol: "padre" });

    res.json({ mensaje: "Clase reiniciada correctamente" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error reiniciando clase" });

  }

});

/**
 * ELIMINAR alumno (solo profesor)
 */
router.delete('/:id', verificarToken, async (req, res) => {

  try {

    if (req.usuario.rol !== "profesor") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const alumnoId = req.params.id;

    // 1. Buscar alumno
    const alumno = await Alumno.findById(alumnoId);

    if (!alumno) {
      return res.status(404).json({ error: "Alumno no encontrado" });
    }

    // 2. Borrar registros de minutos
    await RegistroMinutos.deleteMany({ alumnoId });

    // 3. Buscar usuarios (padres) que tengan este alumno
    const usuarios = await Usuario.find({
      alumnosIds: alumnoId
    });

    for (const usuario of usuarios) {

      // Quitar el alumno del array
      usuario.alumnosIds = usuario.alumnosIds.filter(
        id => id.toString() !== alumnoId
      );

      // Si no tiene más hijos → borrar usuario padre
      if (usuario.alumnosIds.length === 0 && usuario.rol === "padre") {
        await Usuario.findByIdAndDelete(usuario._id);
      } else {
        await usuario.save();
      }

    }

    // 4. Borrar alumno
    await Alumno.findByIdAndDelete(alumnoId);

    res.json({ mensaje: "Alumno eliminado correctamente" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error eliminando alumno" });

  }

});


export default router;
