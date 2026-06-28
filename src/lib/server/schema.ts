import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Tabla de Usuarios para el control de accesos básico
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  role: text('role').$type<'admin' | 'user'>().default('user').notNull(), // Control de roles simplificado
});


export const sensorData = sqliteTable('sensor_data', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  deviceId: text('device_id').notNull(),
  temperature: integer('temperature'),
  humidity: integer('humidity'),
  timestamp: integer('timestamp').notNull(),
});