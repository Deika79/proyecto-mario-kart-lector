import express from 'express';
import Alumno from '../models/Alumno.js';
import RegistroMinutos from '../models/RegistroMinutos.js';
import Usuario from '../models/Usuario.js';
import verificarToken from '../middleware/auth.js';

const router = express.Router();

const LIMITE_DIARIO = 30;


/**
 * POST /api/registros
 * { alumnoId, minutos }
 * Uso normal (padres)
 */
router.post('/', verificarToken, async (req, res) => {
  try {
    const { alumnoId } = req.body;
    const minutos = Number(req.body.minutos);

    if (!alumnoId || isNaN(minutos)) {
      return res.status(400).json({ error: 'Faltan datos o minutos inválidos' });
    }

    if (minutos <= 0) {
      return res.status(400).json({ error: 'Minutos inválidos' });
    }

    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    // 🔐 CONTROL POR ROL
    if (req.usuario.rol === "padre") {

      const usuario = await Usuario.findById(req.usuario.id);

      if (!usuario || !usuario.alumnoId) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      if (usuario.alumnoId.toString() !== alumnoId) {
        return res.status(403).json({
          error: 'No puedes registrar minutos a este alumno'
        });
      }

    }

    // 🗓 CALCULAR INICIO Y FIN DEL DÍA
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(inicioDia);
    finDia.setDate(finDia.getDate() + 1);

    const registrosHoy = await RegistroMinutos.find({
      alumnoId,
      fecha: { $gte: inicioDia, $lt: finDia }
    });

    const minutosHoy = registrosHoy.reduce(
      (total, r) => total + r.minutos,
      0
    );

    if (minutosHoy + minutos > LIMITE_DIARIO) {
      return res.status(400).json({
        error: `Límite diario de ${LIMITE_DIARIO} minutos superado. Ya tiene ${minutosHoy} minutos hoy.`
      });
    }

    await RegistroMinutos.create({
      alumnoId,
      minutos,
      fecha: new Date()
    });

    alumno.minutosTotales += minutos;
    await alumno.save();

    res.json({ ok: true, alumno });

  } catch (error) {

    console.error('Error registrando minutos:', error);
    res.status(500).json({ error: error.message });

  }
});


/**
 * ⭐ NUEVO ENDPOINT
 * POST /api/registros/manual
 * Uso exclusivo del profesor
 * SIN límite diario
 */
router.post('/manual', verificarToken, async (req, res) => {

  try {

    if (req.usuario.rol !== "profesor") {
      return res.status(403).json({ error: "Solo el profesor puede añadir minutos manualmente" });
    }

    const { alumnoId } = req.body;
    const minutos = Number(req.body.minutos);

    if (!alumnoId || isNaN(minutos) || minutos <= 0) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const alumno = await Alumno.findById(alumnoId);

    if (!alumno) {
      return res.status(404).json({ error: "Alumno no encontrado" });
    }

    await RegistroMinutos.create({
      alumnoId,
      minutos,
      fecha: new Date()
    });

    alumno.minutosTotales += minutos;
    await alumno.save();

    res.json({ ok: true, alumno });

  } catch (error) {

    console.error("Error añadiendo minutos manuales:", error);
    res.status(500).json({ error: error.message });

  }

});


export default router;