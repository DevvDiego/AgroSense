import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

let db: any;

if (env.NODE_ENV === 'production') {
    const sqlClient = neon(env.DATABASE_URL!);
    db = drizzleNeon(sqlClient, { schema });
} else {
    // En tu computadora: Usamos libsql apuntando a tu archivo local
    const sqliteClient = createClient({ url: 'file:local.db' });
    db = drizzleSqlite(sqliteClient, { schema });
}

export { db };