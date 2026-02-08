import express from 'express';
import cors from 'cors';
import alumnosRoutes from './routes/alumnos.routes.js';
import registrosRoutes from './routes/registros.routes.js';
import posicionesRoutes from './routes/posiciones.routes.js';



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/alumnos', alumnosRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/posiciones', posicionesRoutes);


app.get('/', (req, res) => {
  res.send('API Mario Kart Lector funcionando 🏁');
});

export default app;
