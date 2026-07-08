import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { sensorData } from '$lib/server/schema';
import { eq, avg, max, count } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
    const startTime = Date.now();
    
    // Obtener el deviceId desde la URL (?deviceId=lector_01)
    const deviceId = url.searchParams.get('deviceId');

    if (!deviceId) {
        return json(
            { error: 'El parámetro "deviceId" es requerido.' },
            { status: 400 }
        );
    }

    try {
        // Procesar y agregar los datos usando funciones de Drizzle
        const stats = await db
            .select({
                totalReadings: count(sensorData.id),
                avgTemperature: avg(sensorData.temperature),
                maxTemperature: max(sensorData.temperature),
                avgHumidity: avg(sensorData.humidity),
                maxHumidity: max(sensorData.humidity),
            })
            .from(sensorData)
            .where(eq(sensorData.deviceId, deviceId));

        if (!stats[0] || stats[0].totalReadings === 0) {
            return json({
                deviceId,
                message: 'No se encontraron datos para este dispositivo.',
                processed_at: new Date().toISOString(),
                metrics: null
            });
        }

        return json({
            deviceId,
            processed_at: new Date().toISOString(),
            execution_time_ms: Date.now() - startTime,
            metrics: {
                total_records: stats[0].totalReadings,
                temperature: {
                    average: Math.round(Number(stats[0].avgTemperature) * 10) / 10,
                    maximum: stats[0].maxTemperature
                },
                humidity: {
                    average: Math.round(Number(stats[0].avgHumidity) * 10) / 10,
                    maximum: stats[0].maxHumidity
                }
            }
        });

    } catch (error) {
        console.error('Error al procesar datos del sensor:', error);
        return json(
            { error: 'Error interno al procesar los datos de analítica.' },
            { status: 500 }
        );
    }
};