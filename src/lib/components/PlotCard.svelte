<script lang="ts">
	import SensorCard from './SensorCard.svelte';

	let { parcela } = $props();
</script>

<div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
	<div class="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
		<div>
			<h2 class="text-lg font-semibold text-slate-800">{parcela.name}</h2>
			{#if parcela.location}
				<p class="text-xs text-slate-500">📍 {parcela.location}</p>
			{/if}
		</div>
		<span class="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
			Cultivo: {parcela.cropType}
		</span>
	</div>

	<div class="p-4">
		<div class="mb-3 flex items-center justify-between">
			<h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">
				Sensores Asignados ({parcela.sensores?.length ?? 0})
			</h3>
		</div>

		{#if !parcela.sensores || parcela.sensores.length === 0}
			<p class="text-xs text-slate-400 italic py-2">No hay sensores asignados a este terreno.</p>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each parcela.sensores as sensor (sensor.id)}
					<SensorCard {sensor} />
				{/each}
			</div>
		{/if}
	</div>
</div>