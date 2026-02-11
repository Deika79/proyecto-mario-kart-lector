// backend/src/controllers/registros.controller.js
import Alumno from '../models/alumno.model.js';
import RegistroMinutos from '../models/registro.model.js';

export const crearRegistro = async (req, res) => {
  try {
    const { alumnoId, minutos } = req.body;

    if (!alumnoId || !minutos) {
      return res.status(400).json({ error: 'Alumno y minutos son obligatorios' });
    }

    // Crear registro
    const registro = await RegistroMinutos.create({ alumnoId, minutos, fecha: new Date() });

    // Actualizar minutosTotales del alumno
    const alumno = await Alumno.findById(alumnoId);
    if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });

    alumno.minutosTotales += minutos;
    await alumno.save();

    res.status(201).json({ registro, alumno });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar minutos' });
  }
};
