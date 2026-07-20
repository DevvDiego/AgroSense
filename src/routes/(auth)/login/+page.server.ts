import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { message: 'Email y contraseña son requeridos' });
		}

		// Buscar usuario por Email
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (!user) {
			return fail(400, { message: 'Credenciales inválidas' });
		}

		// Verificar si la contraseña ingresada coincide con el Hash guardado
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return fail(400, { message: 'Credenciales inválidas' });
		}

		// Crear cookie segura HTTP-Only
		cookies.set('session_user_id', String(user.id), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 1 semana
		});

		throw redirect(303, '/dashboard');
	}
};