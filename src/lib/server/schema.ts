import { mysqlTable, varchar, text, int, timestamp } from 'drizzle-orm/mysql-core';

// usuarios
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(), // <-- Campo de contraseña hasheada
  role: varchar('role', { length: 20 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow()
});

// parcelas
export const plots = mysqlTable('plots', {
  id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 100 }).notNull(),
	location: text('location'), // Notas de ubicacion o coordenadas en texto plano
	cropType: varchar('crop_type', { length: 50 }).notNull(),
	clientId: int('client_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }), // Pertenece a un cliente
	createdAt: timestamp('created_at').defaultNow()
});

// sensores
export const sensors = mysqlTable('sensors', {
  id: int('id').primaryKey().autoincrement(),
	deviceId: varchar('device_id', { length: 50 }).notNull().unique(), // ID unico del hardware (MAC addr, etc.)
	model: varchar('model', { length: 50 }).notNull(), // Ej: "AgroNode-V1"
	status: varchar('status', { length: 20 }).notNull().default('active'), // active, maintenance, inactive
	plotId: int('plot_id')
		.notNull()
		.references(() => plots.id, { onDelete: 'cascade' }), // a que parcela esta asignado
	createdAt: timestamp('created_at').defaultNow()
});

// lecturas
export const sensorReadings = mysqlTable('sensor_readings', {
  id: int('id').primaryKey().autoincrement(),
	sensorId: int('sensor_id')
		.notNull()
		.references(() => sensors.id, { onDelete: 'cascade' }),
	temperature: int('temperature').notNull(), // Almacenado como entero o procesado
	humidity: int('humidity').notNull(), // Humedad del suelo %
	ph: int('ph'), // Multiplicado por 10 o 100 en el payload para guardarlo como entero sin romper compatibilidad
	batteryLevel: int('battery_level'), // % de batería del dispositivo IoT
	timestamp: timestamp('timestamp').defaultNow() // Momento exacto de la lectura
});