import { Router } from 'express';
import { getTasks, createTask, saveTasksBulk, updateTask, deleteTask } from '../controllers/task.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, getTasks);
router.post('/', verifyToken, createTask);
router.post('/bulk', verifyToken, saveTasksBulk);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, deleteTask);

export default router;
