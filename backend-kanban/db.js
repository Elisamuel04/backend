import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kanban_db',
  password: 'samuel',
  port: 5433,
});

export default pool;
