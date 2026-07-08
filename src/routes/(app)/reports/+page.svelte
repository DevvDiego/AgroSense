<script lang="ts">
	let deviceId = '';
	let loading = false;
	let error: string | null = null;
	let reportData: any = null;

	async function fetchReport() {
		if (!deviceId.trim()) return;

		loading = true;
		error = null;
		reportData = null;

		try {
			const res = await fetch(`/api/v1/analytics?deviceId=${encodeURIComponent(deviceId)}`);
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Ocurrió un error al consultar el reporte.');
			}

			reportData = data;
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}
</script>

<div class="container mx-auto p-6 max-w-4xl">
	<h1 class="text-3xl font-bold text-slate-800 mb-2">Reporte de Analítica AgroSense</h1>
	<p class="text-slate-600 mb-6">Consulta las métricas consolidadas y promedios históricos de tus dispositivos IoT de campo.</p>

	<div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
		<form on:submit|preventDefault={fetchReport} class="flex flex-col sm:flex-row gap-4 items-end">
			<div class="flex-1 w-full">
				<label for="deviceId" class="block text-sm font-semibold text-slate-700 mb-2">
					Identificador del Dispositivo
				</label>
				<input
					id="deviceId"
					type="text"
					bind:value={deviceId}
					placeholder="Ej: sensor_campo_01"
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
					required
				/>
			</div>
			<button
				type="submit"
				disabled={loading}
				class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:bg-emerald-400"
			>
				{loading ? 'Procesando...' : 'Generar Reporte'}
			</button>
		</form>
	</div>

	{#if loading}
		<div class="text-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
			<p class="text-slate-500">Calculando métricas agregadas desde la base de datos...</p>
		</div>
	{:else if error}
		<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-red-700 mb-6">
			<p class="font-bold">Error</p>
			<p>{error}</p>
		</div>
	{:else if reportData}
		
		{#if !reportData.metrics}
			<div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg text-amber-700">
				<p class="font-bold">Sin registros</p>
				<p>{reportData.message}</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				
				<div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
					<p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Muestras Procesadas</p>
					<p class="text-3xl font-bold text-slate-800 mt-2">{reportData.metrics.total_records}</p>
					<p class="text-xs text-slate-400 mt-1">Lecturas totales en historial</p>
				</div>

				<div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
					<p class="text-sm font-medium text-slate-500 uppercase tracking-wider text-orange-600">Temperatura</p>
					<div class="mt-2">
						<span class="text-3xl font-bold text-slate-800">{reportData.metrics.temperature.average}°C</span>
						<span class="text-sm text-slate-500 ml-1">(Promedio)</span>
					</div>
					<p class="text-xs text-slate-500 mt-1">Máxima registrada: <span class="font-semibold">{reportData.metrics.temperature.maximum}°C</span></p>
				</div>

				<div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
					<p class="text-sm font-medium text-slate-500 uppercase tracking-wider text-blue-600">Humedad Relativa</p>
					<div class="mt-2">
						<span class="text-3xl font-bold text-slate-800">{reportData.metrics.humidity.average}%</span>
						<span class="text-sm text-slate-500 ml-1">(Promedio)</span>
					</div>
					<p class="text-xs text-slate-500 mt-1">Máxima registrada: <span class="font-semibold">{reportData.metrics.humidity.maximum}%</span></p>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row justify-between text-xs text-slate-400 border-t border-slate-200 pt-4">
				<p>ID Dispositivo: <span class="font-mono text-slate-600 font-semibold">{reportData.deviceId}</span></p>
				<p>Generado el: {new Date(reportData.processed_at).toLocaleString()}</p>
				<p>Tiempo de consulta API: {reportData.execution_time_ms}ms</p>
			</div>
		{/if}
	{/if}
</div>