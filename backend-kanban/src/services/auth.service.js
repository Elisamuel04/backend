import { createUserDB, findUserByUsernameDB } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerService  = async (username, password) => {
  if (!username || !password)
    throw new Error('Usuario y contraseña son requeridos');

  const existingUser = await findUserByUsernameDB(username);
  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await createUserDB(username, hashed);
  return user;

};

export const loginService  = async (username, password) => {
    const user = await findUserByUsernameDB(username);
    if (!user) throw new Error('Credenciales inválidas');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Credenciales inválidas');

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    return { token, user: { id: user.id, username: user.username } };
};
