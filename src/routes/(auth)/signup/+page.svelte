<script lang="ts">
  import { enhance } from '$app/forms';

  let { form } = $props();
  let loading = $state(false);
</script>

<svelte:head>
  <title>Crear Cuenta | AgroSense</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900">
  <div class="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
    
    <div class="text-center">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
        🌱
      </div>
      <h2 class="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Crea tu cuenta en AgroSense
      </h2>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Comienza a monitorear tus parcelas y sensores IoT
      </p>
    </div>

    {#if form?.error}
      <div class="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 dark:bg-red-950/50 dark:border-red-900 dark:text-red-400" role="alert">
        <span class="font-medium">Error:</span> {form.error}
      </div>
    {/if}

    <form 
      method="POST" 
      use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          loading = false;
          await update();
        };
      }}
      class="space-y-5"
    >
      <div>
        <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Nombre Completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form?.name ?? ''}
          placeholder="Juan Pérez"
          class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Correo Electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form?.email ?? ''}
          placeholder="usuario@ejemplo.com"
          class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minlength="6"
          placeholder="••••••••"
          class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
        <p class="mt-1 text-xs text-slate-500">Mínimo 6 caracteres</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="flex w-full justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
      >
        {#if loading}
          Procesando...
        {:else}
          Registrarse
        {/if}
      </button>
    </form>

    <p class="text-center text-sm text-slate-600 dark:text-slate-400">
      ¿Ya tienes una cuenta?
      <a href="/login" class="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
        Inicia sesión aquí
      </a>
    </p>

  </div>
</div>