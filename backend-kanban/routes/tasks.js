import { Router } from 'express';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// POST /tasks
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
    console.error(error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

// PUT /tasks/:id
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
    console.error(error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});


export default router;
