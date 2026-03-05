import express from 'express';
import cors from 'cors';
import alumnosRoutes from './routes/alumnos.routes.js';
import registrosRoutes from './routes/registros.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

/* ===== CORS ===== */

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://proyecto-mario-kart-lector.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {

    // permitir Postman o requests sin origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS no permitido: " + origin));

  },
  credentials: true
}));

/* ===== MIDDLEWARE ===== */

app.use(express.json());

/* ===== ROUTES ===== */

app.use('/api/alumnos', alumnosRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/auth', authRoutes);

/* ===== TEST ROUTE ===== */

app.get('/', (req, res) => {
  res.send('API Mario Kart Lector funcionando 🏁');
});

export default app;