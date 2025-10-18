// server.js
import express from 'express';
import tasksRouter from './routes/tasks.js'; // tu archivo de rutas
import pool from './db.js';

const app = express();
app.use(express.json());

app.use('/tasks', tasksRouter);

app.listen(3000, () => console.log('Server running on port 3000'));
