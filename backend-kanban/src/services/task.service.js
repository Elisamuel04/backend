import {  findAllTasks, createTaskDB, saveTasksBulkDB, updateTaskDB, deleteTaskDB,} from '../models/task.model.js';

export const getTasksService = async () => {
  return await findAllTasks();
};

export const createTaskService = async (data) => {
  if (!data.title || data.title.length < 3) {
    throw new Error('El título debe tener al menos 3 caracteres');
  }
  return await createTaskDB(data);
};

export const saveTasksBulkService = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('No se recibieron tareas válidas');
  }
  await saveTasksBulkDB(items);
  return { message: '✅ Tareas guardadas correctamente', count: items.length };
};

export const updateTaskService = async (id, data) => {
  const updated = await updateTaskDB(id, data);
  if (!updated) throw new Error('Tarea no encontrada');
  return updated;
};

export const deleteTaskService = async (id) => {
  const deleted = await deleteTaskDB(id);
  if (!deleted) throw new Error('Tarea no encontrada');
  return { message: 'Tarea eliminada' };
};
