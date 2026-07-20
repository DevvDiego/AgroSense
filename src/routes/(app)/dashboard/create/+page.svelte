<script lang="ts">
	import type { PageData, ActionData } from './$types';
	
	let {data, form}: {data:PageData, form:ActionData} = $props();
</script>

<div class="max-w-4xl mx-auto p-6 space-y-10">
	<h1 class="text-3xl font-bold text-emerald-800">Gestión de Parcelas y Sensores</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
		
		<section class="bg-white p-6 rounded-xl shadow-md border border-slate-200">
			<h2 class="text-xl font-semibold mb-4 text-slate-800">🌱 Nueva Parcela</h2>

			{#if form?.errorParcela}
				<p class="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{form.errorParcela}</p>
			{/if}
			{#if form?.successParcela}
				<p class="mb-4 text-sm text-emerald-600 bg-emerald-50 p-3 rounded">¡Parcela guardada con éxito!</p>
			{/if}

			<form method="POST" action="?/crearParcela" class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-slate-700">Nombre de la Parcela</label>
					<input type="text" name="name" required placeholder="Ej: Finca La Aurora" class="w-full mt-1 p-2 border rounded-md" />
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-700">Tipo de Cultivo</label>
					<input type="text" name="cropType" required placeholder="Ej: Maíz, Aguacate" class="w-full mt-1 p-2 border rounded-md" />
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-700">Ubicación / Notas</label>
					<textarea name="location" rows="3" placeholder="Ej: Sector Norte, Coordenadas..." class="w-full mt-1 p-2 border rounded-md"></textarea>
				</div>

				<button type="submit" class="w-full bg-emerald-600 text-white font-medium py-2 rounded-md hover:bg-emerald-700 transition">
					Guardar Parcela
				</button>
			</form>
		</section>

		<section class="bg-white p-6 rounded-xl shadow-md border border-slate-200">
			<h2 class="text-xl font-semibold mb-4 text-slate-800">📡 Vincular Nuevo Sensor</h2>

			{#if form?.errorSensor}
				<p class="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{form.errorSensor}</p>
			{/if}
			{#if form?.successSensor}
				<p class="mb-4 text-sm text-emerald-600 bg-emerald-50 p-3 rounded">¡Sensor vinculado exitosamente!</p>
			{/if}

			<form method="POST" action="?/crearSensor" class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-slate-700">Seleccionar Parcela</label>
					<select name="plotId" required class="w-full mt-1 p-2 border rounded-md bg-white">
						<option value="" disabled selected>-- Elige una parcela --</option>
						{#each data.plots as plot}
							<option value={plot.id}>{plot.name}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-700">ID Único del Hardware (MAC / UUID)</label>
					<input type="text" name="deviceId" required placeholder="Ej: SN-AGUA-003" class="w-full mt-1 p-2 border rounded-md" />
				</div>

				<div>
					<label class="block text-sm font-medium text-slate-700">Modelo del Sensor</label>
					<input type="text" name="model" required placeholder="Ej: AgroNode-V1" class="w-full mt-1 p-2 border rounded-md" />
				</div>

				<button 
					type="submit" 
					disabled={data.plots.length === 0}
					class="w-full bg-slate-800 text-white font-medium py-2 rounded-md hover:bg-slate-900 transition disabled:opacity-50"
				>
					Vincular Sensor
				</button>

				{#if data.plots.length === 0}
					<p class="text-xs text-amber-600">Debes crear al menos una parcela antes de vincular un sensor.</p>
				{/if}
			</form>
		</section>

	</div>
</div>