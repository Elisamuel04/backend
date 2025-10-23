import express from 'express';
import cors from 'cors';
import taskRoutes from './src/routes/task.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import errorHandler from './src/middleware/error.middleware.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/tasks',  taskRoutes);
app.use('/api/auth', authRoutes);

// Middleware global de errores
app.use(errorHandler);

export default app;