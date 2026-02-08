import 'dotenv/config';
import mongoose from 'mongoose';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🍃 MongoDB Atlas conectado correctamente');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('💥 ERROR ARRANCANDO SERVIDOR:', error);
  }
};

startServer();
