import { pool } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// ✅ Obtener todas las tareas
export const getTasks = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// ✅ Crear una sola tarea
export const createTask = async (req, res, next) => {
  const { title, description, status } = req.body;
  if (!title || title.length < 3)
    return res.status(400).json({ error: 'El título debe tener al menos 3 caracteres' });

  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [uuidv4(), title, description || '', status || 'todo']
    );
    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    next(error);
  }
};

// ✅ Crear o actualizar varias tareas
export const saveTasksBulk = async (req, res, next) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No se recibieron tareas válidas' });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    for (const item of items) {
      const id = item.id || uuidv4();
      const title = item.title || 'Sin título';
      const description = item.description || '';
      const status = item.status || 'todo';
      const priority = item.priority || 0;

      await client.query(
        `INSERT INTO tasks (id, title, description, status, priority)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id)
         DO UPDATE SET title=$2, description=$3, status=$4, priority=$5`,
        [id, title, description, status, priority]
      );
    }

    await client.query('COMMIT');
    client.release();

    res.json({ message: '✅ Tareas guardadas correctamente', count: items.length });
  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    next(error);
  }
};

// ✅ Actualizar una tarea
export const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tasks SET title=$1, description=$2, status=$3 WHERE id=$4 RETURNING *',
      [title, description, status, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// ✅ Eliminar una tarea
export const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    next(error);
  }
};
