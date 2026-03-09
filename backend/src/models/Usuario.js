import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  rol: {
    type: String,
    enum: ["profesor", "padre"],
    required: true
  },

  alumnosIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumno"
  }]

});

export default mongoose.model("Usuario", usuarioSchema);