import mongoose from 'mongoose';

const alumnoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    cocheSeleccionado: {
      type: String,
      default: null,
    },
    minutosTotales: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Alumno', alumnoSchema);