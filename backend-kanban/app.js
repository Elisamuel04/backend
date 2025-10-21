import express from 'express';
import cors from 'cors';
import taskRoutes from './src/routes/task.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import errorHandler from './src/middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/tasks',  taskRoutes);
app.use('/api/auth', authRoutes);

// Middleware global de errores
app.use(errorHandler);

export default app;
