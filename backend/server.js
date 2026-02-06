import 'dotenv/config';
import mongoose from 'mongoose';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🍃 MongoDB Atlas conectado correctamente');
} catch (error) {
  console.error('❌ Error conectando a MongoDB:', error.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
