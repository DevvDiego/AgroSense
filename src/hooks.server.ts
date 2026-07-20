import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Obtener el ID almacenado en la cookie (ej. "3")
	const userIdCookie = event.cookies.get('session_user_id');

	if (userIdCookie) {
		const userId = Number(userIdCookie);

		if (!isNaN(userId)) {
			// 2. Buscar al usuario en la base de datos usando el ID
			const [user] = await db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					role: users.role
				})
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			// 3. Asignar el objeto del usuario a locals (o null si no existía)
			event.locals.user = user ?? null;
		} else {
			event.locals.user = null;
		}
	} else {
		// Si no hay cookie, asegurarse de que locals.user sea null
		event.locals.user = null;
	}

	return resolve(event);
};