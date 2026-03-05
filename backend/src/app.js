import express from 'express';
import cors from 'cors';
import alumnosRoutes from './routes/alumnos.routes.js';
import registrosRoutes from './routes/registros.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Orígenes permitidos
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://mario-kart-lector.vercel.app' // luego pondremos tu dominio real de Vercel
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}));

app.use(express.json());

app.use('/api/alumnos', alumnosRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Mario Kart Lector funcionando 🏁');
});

export default app;