import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { DATABASE_URL } from '$env/static/private';

// Creamos un pool de conexiones optimizado para el ciclo de vida de SvelteKit
const poolConnection = mysql.createPool({
  uri: DATABASE_URL,
});

export const db = drizzle({ client: poolConnection });