import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db'; // Ajusta a tu instancia de Drizzle
import { plots, sensors } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

// Cargar parcelas existentes para el selector de vinculación
export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	// Traer únicamente las parcelas del usuario autenticado
	const userPlots = await db
		.select({
			id: plots.id,
			name: plots.name
		})
		.from(plots)
		.where(eq(plots.clientId, locals.user.id));

	return {
		plots: userPlots
	};
};

export const actions: Actions = {
	// Accion 1: Crear Parcela
	crearParcela: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const cropType = formData.get('cropType')?.toString().trim();
		const location = formData.get('location')?.toString().trim() || null;

		if (!name || !cropType) {
			return fail(400, {
				errorParcela: 'El nombre y el tipo de cultivo son obligatorios'
			});
		}

		try {
			await db.insert(plots).values({
				name,
				cropType,
				location,
				clientId: locals.user.id
			});
		} catch (err) {
			console.error(err);
			return fail(500, { errorParcela: 'Error al crear la parcela en la base de datos' });
		}

		return { successParcela: true };
	},

	// Accion 2: Crear y Vincular Sensor a una Parcela
	crearSensor: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const formData = await request.formData();
		const deviceId = formData.get('deviceId')?.toString().trim();
		const model = formData.get('model')?.toString().trim();
		const plotIdRaw = formData.get('plotId')?.toString();

		if (!deviceId || !model || !plotIdRaw) {
			return fail(400, { errorSensor: 'Todos los campos son obligatorios' });
		}

		const plotId = parseInt(plotIdRaw, 10);

		// Verificación de seguridad: Asegurarnos de que la parcela pertenece al usuario
		const [parcelaPertenece] = await db
			.select()
			.from(plots)
			.where(eq(plots.id, plotId))
			.where(eq(plots.clientId, locals.user.id));

		if (!parcelaPertenece) {
			return fail(403, { errorSensor: 'No tienes permiso para añadir sensores a esta parcela' });
		}

		try {
			await db.insert(sensors).values({
				deviceId,
				model,
				plotId,
				status: 'active'
			});
		} catch (err: any) {
			// Manejar duplicados de device_id (campo UNIQUE)
			if (err?.code === 'ER_DUP_ENTRY') {
				return fail(400, { errorSensor: 'El ID de dispositivo ya está registrado en el sistema' });
			}
			console.error(err);
			return fail(500, { errorSensor: 'Error al vincular el sensor' });
		}

		return { successSensor: true };
	}
};