import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRoutes from './routes/tasks.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor escuchando en puerto ${PORT}`));
