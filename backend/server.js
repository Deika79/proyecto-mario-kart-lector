import 'dotenv/config';
import mongoose from 'mongoose';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    /* =========================
       CONEXIÓN A MONGODB
       ========================= */

    await mongoose.connect(process.env.MONGO_URI);

    console.log('🍃 MongoDB Atlas conectado correctamente');


    /* =========================
       ARRANQUE DEL SERVIDOR
       ========================= */

    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);

      /* =========================
         PRECALENTAR RUTAS
         ========================= */

      try {
        fetch(`http://localhost:${PORT}/ping`)
          .then(() => console.log("🔥 Backend precalentado"))
          .catch(() => {});
      } catch (e) {}
    });

  } catch (error) {

    console.error('💥 ERROR ARRANCANDO SERVIDOR:', error);
    process.exit(1);

  }
};

startServer();