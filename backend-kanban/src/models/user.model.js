import { pool } from '../config/db.js';

export const createUserDB  = async (username, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
    [username, hashedPassword]
  );
  return result.rows[0];
};

export const findUserByUsernameDB  = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
    return result.rows[0];
};
