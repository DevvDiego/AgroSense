import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    role: varchar('role', { length: 50 }).$type<'admin' | 'user'>().default('user').notNull(),
});

export const sensorData = mysqlTable('sensor_data', {
    id: int('id').primaryKey().autoincrement(),
    deviceId: varchar('device_id', { length: 100 }).notNull(),
    temperature: int('temperature'),
    humidity: int('humidity'),
    timestamp: int('timestamp').notNull(),
});