import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies, locals }) => {
		// Eliminar la cookie de sesión
		cookies.delete('session', { path: '/' });
		locals.user = null;

		throw redirect(303, '/login');
	}
};