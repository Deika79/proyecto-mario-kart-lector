import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

/**
 * REGISTRO
 */
router.post('/register', async (req, res) => {

  try {

    const { nombre, email, password, rol, alumnoId } = req.body;

    const hash = await bcrypt.hash(password, 10);

    let usuario = await Usuario.findOne({ email });

    // Si el usuario ya existe
    if (usuario) {

      if (rol === "padre") {

        // asegurar que existe el array
        if (!usuario.alumnosIds) {
          usuario.alumnosIds = [];
        }

        // añadir alumno si no está ya
        if (!usuario.alumnosIds.includes(alumnoId)) {
          usuario.alumnosIds.push(alumnoId);
          await usuario.save();
        }

        return res.json({ message: "Alumno añadido al padre existente" });

      }

      return res.status(400).json({ error: "Usuario ya existe" });

    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hash,
      rol,
      alumnosIds: rol === "padre" ? [alumnoId] : []
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario creado" });

  } catch (error) {

    console.error("Error registro:", error);
    res.status(500).json({ error: error.message });

  }

});

/**
 * LOGIN
 */
router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const valido = await bcrypt.compare(password, usuario.password);

    if (!valido) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, rol: usuario.rol });

  } catch (error) {

    console.error("Error login:", error);
    res.status(500).json({ error: error.message });

  }
});

/**
 * OBTENER USUARIOS (SIN PASSWORD)
 */
router.get('/', async (req, res) => {
  try {

    const usuarios = await Usuario.find().select('-password');

    res.json(usuarios);

  } catch (error) {

    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ error: 'Error obteniendo usuarios' });

  }
});

export default router;