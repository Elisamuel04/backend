import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT, 10),
});

pool.on('connect', () => console.log('🟢 Connected to PostgreSQL'));
pool.on('error', (err) => console.error('🔴 DB Error:', err));
