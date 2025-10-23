import { pool } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// 🧩 Obtener todas las tareas
export const findAllTasks = async () => {
  const result = await pool.query('SELECT * FROM tasks ORDER BY status, order_index ASC');
  return result.rows;
};

// 🧩 Crear una tarea
export const createTaskDB = async ({ title, description, status }) => {
  const result = await pool.query(
    'INSERT INTO tasks (id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [uuidv4(), title, description || '', status || 'todo']
  );
  return result.rows[0];
};

// 🧩 Guardar varias tareas (bulk)
export const saveTasksBulkDB = async (items) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const item of items) {
      const id = item.id || uuidv4();
      const title = item.title || 'Sin título';
      const description = item.description || '';
      const status = item.status || 'todo';
      const priority = item.priority || 'Baja';
      const order_index = item.order_index ?? 0;

      await client.query(
        `INSERT INTO tasks (id, title, description, status, priority, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id)
         DO UPDATE SET title=$2, description=$3, status=$4, priority=$5, order_index=$6`,
        [id, title, description, status, priority, order_index]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// 🧩 Actualizar tarea
export const updateTaskDB = async (id, { title, description, status }) => {
  const result = await pool.query(
    'UPDATE tasks SET title=$1, description=$2, status=$3 WHERE id=$4 RETURNING *',
    [title, description, status, id]
  );
  return result.rows[0];
};

// 🧩 Eliminar tarea
export const deleteTaskDB = async (id) => {
  const result = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [id]);
  return result.rows[0];
};
