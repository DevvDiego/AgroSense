import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  	if (!locals.user) {
  		  throw redirect(303, '/login');
  	}

	  // 2. Retornar el usuario para que (app) y sus hijos tengan acceso a data.user
	  return {
			user: locals.user
		};
};