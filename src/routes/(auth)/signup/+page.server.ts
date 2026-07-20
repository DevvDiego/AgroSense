import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Si el usuario ya está autenticado, lo redirigimos directamente al dashboard
export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(303, '/dashboard');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim().toLowerCase();
    const password = data.get('password')?.toString();

    // 1. Validaciones básicas
    if (!name || !email || !password) {
      return fail(400, {
        error: 'Todos los campos son obligatorios',
        name,
        email
      });
    }

    if (password.length < 6) {
      return fail(400, {
        error: 'La contraseña debe tener al menos 6 caracteres',
        name,
        email
      });
    }

    try {
      // 2. Verificar si el correo ya está registrado
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser) {
        return fail(400, {
          error: 'El correo electrónico ya está registrado',
          name,
          email
        });
      }

      // 3. Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. Insertar el nuevo usuario
      const [result] = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        role: 'user' // Rol por defecto
      });

      const newUserId = result.insertId;

      // 5. Iniciar sesión automáticamente creando la cookie HTTP-Only
      const sessionData = {
        id: newUserId,
        email,
        name,
        role: 'user'
      };

      cookies.set('session', JSON.stringify(sessionData), {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 semana
      });

    } catch (err) {
      console.error('Error al registrar usuario:', err);
      return fail(500, {
        error: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
        name,
        email
      });
    }

    // Redireccionar al dashboard tras un registro exitoso
    throw redirect(303, '/dashboard');
  }
};