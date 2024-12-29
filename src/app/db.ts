import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '../../database/schema';

export const pool = mysql.createPool({
  db: {
    port: process.env.MYSQL_PORT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  connectionLimit: 20,
  multipleStatements: true,
});

export const db = drizzle(pool, {
  schema,
  mode: 'default',
  logger: false,
});
