import { registerService, loginService } from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await registerService(username, password);
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await loginService(username, password);
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
