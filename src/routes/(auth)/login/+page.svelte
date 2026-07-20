<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-slate-50">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		<h2 class="mb-6 text-2xl font-bold text-slate-800">Iniciar Sesión - AgroSense</h2>

		{#if form?.message}
			<div class="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
				{form.message}
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-slate-700">Correo Electrónico</label>
				<input
					type="email"
					name="email"
					id="email"
					value={form?.email ?? ''}
					required
					class="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-slate-700">Contraseña</label>
				<input
					type="password"
					name="password"
					id="password"
					required
					class="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm focus:border-emerald-500 focus:outline-none"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 font-medium transition-colors"
			>
				Ingresar
			</button>
		</form>
	</div>
</div>