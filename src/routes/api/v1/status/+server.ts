import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
    const startTime = Date.now();
    let dbStatus = 'UNKNOWN';
    let dbPingTime = 0;

    try {
        const dbStart = Date.now();
        await db.execute(sql`SELECT 1`);
        dbPingTime = Date.now() - dbStart;
        dbStatus = 'CONNECTED';
    } catch (error) {
        console.error('Error de verificacion en la Base de Datos:', error);
        dbStatus = 'DISCONNECTED';
    }

    const uptime = process.uptime();

    // 503 (Servicio No Disponible)
    const statusCode = dbStatus === 'CONNECTED' ? 200 : 503;

    return json({
        status: statusCode === 200 ? 'UP' : 'DEGRADED',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        latency_ms: Date.now() - startTime,
        services: {
            uptime_seconds: Math.floor(uptime),
            database: {
                status: dbStatus,
                ping_ms: dbPingTime
            }
        }
    },
    {
        status: statusCode
    });
};