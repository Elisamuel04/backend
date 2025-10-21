import { Router } from 'express';
import { getTasks, createTask, saveTasksBulk, updateTask, deleteTask } from '../controllers/task.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getTasks);
router.post('/', createTask);
router.post('/bulk', saveTasksBulk);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
