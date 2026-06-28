<!-- lib/components/DeviceCard.svelte -->
<script>
  let { device, onclick } = $props();
</script>

<button
  onclick={onclick}
  class="bg-white rounded-xl border p-4 text-left hover:shadow-md transition-shadow w-full"
>
  <div class="flex justify-between items-start mb-2">
    <span class="font-medium text-stone-800">{device.name}</span>
    {#if device.status === 'error'}
      <span class="text-red-500 text-xs px-2 py-0.5 bg-red-50 rounded-full">⚠️</span>
    {:else if device.status === 'warning'}
      <span class="text-amber-500 text-xs px-2 py-0.5 bg-amber-50 rounded-full">⚡</span>
    {:else}
      <span class="text-green-600 text-xs px-2 py-0.5 bg-green-50 rounded-full">✓</span>
    {/if}
  </div>

  <div class="flex justify-between items-end">
    <div>
      <p class="text-2xl font-bold text-stone-700">
        {device.value}
      </p>
      <p class="text-xs text-stone-400 mt-1">
        {device.location}
      </p>
    </div>
    <div class="text-right text-xs text-stone-500">
      <div class="flex items-center gap-1 justify-end">
        <span>🔋</span> {device.battery}%
      </div>
      <div class="flex items-center gap-1 justify-end mt-0.5">
        <span>📶</span> {device.signal}/5
      </div>
      {#if device.trend === 'up'}
        <span class="text-green-600">↑</span>
      {:else if device.trend === 'down'}
        <span class="text-red-500">↓</span>
      {:else if device.trend === 'stable'}
        <span class="text-blue-500">→</span>
      {/if}
    </div>
  </div>
</button>