<script lang="ts">
	let { sensor } = $props();

	// Color del indicador de estado del sensor
	const statusColors: Record<string, string> = {
		active: 'bg-emerald-500',
		maintenance: 'bg-amber-500',
		inactive: 'bg-rose-500'
	};
</script>

<div class="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors">
	<div class="flex items-center justify-between mb-3">
		<div class="flex items-center gap-2">
			<span class="w-2.5 h-2.5 rounded-full {statusColors[sensor.status] ?? 'bg-slate-400'}"></span>
			<span class="font-mono text-xs font-semibold text-slate-700">{sensor.deviceId}</span>
		</div>
		<span class="text-[10px] text-slate-400 uppercase font-mono">{sensor.model}</span>
	</div>

	<div class="grid grid-cols-2 gap-2 text-xs">
		<div class="p-2 rounded bg-slate-50">
			<span class="text-slate-400 block text-[10px]">Humedad</span>
			<span class="font-bold text-slate-800">
				{sensor.humidity != null ? `${sensor.humidity}%` : 'N/A'}
			</span>
		</div>

		<div class="p-2 rounded bg-slate-50">
			<span class="text-slate-400 block text-[10px]">Temperatura</span>
			<span class="font-bold text-slate-800">
				{sensor.temperature != null ? `${sensor.temperature}°C` : 'N/A'}
			</span>
		</div>

		<div class="p-2 rounded bg-slate-50">
			<span class="text-slate-400 block text-[10px]">pH Suelo</span>
			<span class="font-bold text-slate-800">
				{sensor.ph != null ? sensor.ph : 'N/A'}
			</span>
		</div>

		<div class="p-2 rounded bg-slate-50">
			<span class="text-slate-400 block text-[10px]">Batería</span>
			<span class="font-bold text-slate-800">
				{sensor.batteryLevel != null ? `${sensor.batteryLevel}%` : 'N/A'}
			</span>
		</div>
	</div>

	{#if sensor.lastUpdate}
		<div class="mt-3 text-[10px] text-slate-400 text-right">
			Actualizado: {new Date(sensor.lastUpdate).toLocaleTimeString()}
		</div>
	{/if}
</div>