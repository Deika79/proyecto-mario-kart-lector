import mongoose from 'mongoose';

const cursoArchivadoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    alumnos: [
      {
        alumnoIdOriginal: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Alumno',
        },
        nombre: String,
        cocheSeleccionado: String,
        minutosTotales: Number,
        registros: [
          {
            minutos: Number,
            fecha: Date,
          }
        ],
      }
    ],
    padres: [
      {
        usuarioIdOriginal: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Usuario',
        },
        nombre: String,
        email: String,
        alumnosIdsOriginales: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Alumno',
          }
        ],
      }
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('CursoArchivado', cursoArchivadoSchema);
