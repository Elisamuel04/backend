import { Router } from 'express';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';



const router = Router();

// ✅ GET /tasks - obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en /tasks GET:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// ✅ POST /tasks - crear una sola tarea
router.post('/', async (req, res) => {
  const { title, description, status } = req.body;

  if (!title || title.length < 3) {
    return res.status(400).json({ error: 'Title is required and must have at least 3 characters' });
  }

  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [uuidv4(), title, description || '', status || 'todo']
    );
    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    console.error('❌ Error en /tasks POST:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

// ✅ POST /tasks/bulk - crear varias tareas
router.post('/bulk', async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No se recibieron tareas válidas' });
  }

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    for (const item of items) {
      const id = item.id || uuidv4();
      const title = item.title || 'Sin título';
      const description = item.description || '';
      const status = item.status || 'todo';

      await client.query(
        `INSERT INTO tasks (id, title, description, status)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id)
         DO UPDATE SET title = $2, description = $3, status = $4`,
        [id, title, description, status]
      );
    }

    await client.query('COMMIT');
    client.release();

    res.json({ message: '✅ Tareas guardadas correctamente', count: items.length });
  } catch (error) {
    console.error('❌ Error en /tasks/bulk:', error);
    res.status(500).json({ error: 'Error al guardar tareas' });
  }
});

// ✅ PUT /tasks/:id - actualizar tarea
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (title && title.length < 3) {
    return res.status(400).json({ error: 'Title must have at least 3 characters' });
  }

  try {
    const result = await pool.query(
      'UPDATE tasks SET title=$1, description=$2, status=$3 WHERE id=$4 RETURNING *',
      [title, description, status, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en /tasks PUT:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

// ✅ DELETE /tasks/:id - eliminar tarea
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('❌ Error en /tasks DELETE:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

export default router;
