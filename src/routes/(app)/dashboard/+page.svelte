<script lang="ts">
	import PlotCard from '$lib/components/PlotCard.svelte';

	// Svelte 5 Rune para recibir las props del servidor
	let { data } = $props();

	// Garantizamos que las parcelas siempre sean un arreglo válido
	let parcelas = $derived(data?.parcelas ?? []);
</script>

<div class="p-6 max-w-7xl mx-auto space-y-6">
	<header class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
		<div>
			<h1 class="text-2xl font-bold text-slate-900">Panel de Parcelas</h1>
			<p class="text-sm text-slate-500">
				Monitoreo en tiempo real de tus terrenos y dispositivos IoT instalados.
			</p>
		</div>
		<div class="flex items-center gap-3">
			<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
				{parcelas.length} Parcela(s) Activas
			</span>
		</div>
	</header>

	{#if parcelas.length === 0}
		<div class="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
			<p class="text-slate-600 font-medium">No tienes parcelas registradas aún.</p>
			<p class="text-xs text-slate-400 mt-1">Vincula una parcela para comenzar a recibir datos de sensores.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6">
			{#each parcelas as parcela (parcela.id)}
				<PlotCard {parcela} />
			{/each}
		</div>
	{/if}
</div>