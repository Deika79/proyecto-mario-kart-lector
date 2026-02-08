import mongoose from 'mongoose';

const registroMinutosSchema = new mongoose.Schema(
  {
    alumnoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumno',
      required: true,
    },
    minutos: {
      type: Number,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('RegistroMinutos', registroMinutosSchema);
