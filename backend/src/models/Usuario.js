import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    enum: ['padre', 'profesor'],
    required: true
  },
  alumnoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alumno'
  }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;