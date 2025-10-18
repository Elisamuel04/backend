// server.js
import express from 'express';
import tasksRouter from './routes/tasks.js'; // tu archivo de rutas
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/tasks', tasksRouter);
app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});