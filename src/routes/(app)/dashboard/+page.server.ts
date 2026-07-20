import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { plots, sensors, sensorReadings } from '$lib/server/schema';
import { eq, inArray, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Validar autenticación
	if (!locals.user) {
		throw error(401, 'No autorizado');
	}

	const userId = locals.user.id;

	// Obtener las parcelas pertenecientes al usuario actual
	const userPlots = await db
		.select()
		.from(plots)
		.where(eq(plots.clientId, userId));

	if (userPlots.length === 0) {
		return { parcelas: [] };
	}

	const plotIds = userPlots.map((p) => p.id);

	// 3. Obtener todos los sensores vinculados a las parcelas del usuario
	const userSensors = await db
		.select()
		.from(sensors)
		.where(inArray(sensors.plotId, plotIds));

	// 4. Obtener las últimas lecturas para los sensores encontrados
	let latestReadingsMap = new Map<number, typeof sensorReadings.$inferSelect>();

	if (userSensors.length > 0) {
		const sensorIds = userSensors.map((s) => s.id);

		// Obtenemos las lecturas ordenadas por fecha reciente
		const readings = await db
			.select()
			.from(sensorReadings)
			.where(inArray(sensorReadings.sensorId, sensorIds))
			.orderBy(desc(sensorReadings.timestamp));

		// Nos quedamos únicamente con la lectura más reciente de cada sensor
		for (const reading of readings) {
			if (!latestReadingsMap.has(reading.sensorId)) {
				latestReadingsMap.set(reading.sensorId, reading);
			}
		}
	}

	// Estructurar el árbol de datos (Parcelas -> Sensores -> Última Lectura)
	const parcelasEstructuradas = userPlots.map((plot) => {
		const parcelSensors = userSensors
			.filter((sensor) => sensor.plotId === plot.id)
			.map((sensor) => {
				const lastReading = latestReadingsMap.get(sensor.id);
				return {
					id: sensor.id,
					deviceId: sensor.deviceId,
					model: sensor.model,
					status: sensor.status,
					// Ajustamos la escala de pH si fue guardado como entero (ej: 65 -> 6.5)
					ph: lastReading?.ph != null ? lastReading.ph / 10 : null,
					humidity: lastReading?.humidity ?? null,
					temperature: lastReading?.temperature ?? null,
					batteryLevel: lastReading?.batteryLevel ?? null,
					lastUpdate: lastReading?.timestamp ?? null
				};
			});

		return {
			id: plot.id,
			name: plot.name,
			location: plot.location,
			cropType: plot.cropType,
			sensores: parcelSensors
		};
	});

	return {
		parcelas: parcelasEstructuradas
	};
};