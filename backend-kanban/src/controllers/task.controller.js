import { getTasksService, createTaskService, saveTasksBulkService, updateTaskService, deleteTaskService } from '../services/task.service.js';

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await getTasksService();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await createTaskService(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const saveTasksBulk = async (req, res, next) => {
  try {
    const result = await saveTasksBulkService(req.body.items);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const updated = await updateTaskService(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const result = await deleteTaskService(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
