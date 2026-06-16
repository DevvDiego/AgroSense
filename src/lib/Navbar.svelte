<script>
    let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}
</script>

<nav class="relative z-50 flex items-center justify-between bg-emerald-900 px-6 py-3 text-white shadow-md font-sans">
	
	<a href="/" class="flex items-center gap-2 no-underline text-inherit" onclick={closeMenu}>
		<svg class="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
		</svg>
		<span class="text-xl font-bold tracking-wide">AgroSense</span>
	</a>

	<div class="relative">
		<button 
			class="cursor-pointer rounded-md bg-emerald-900 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
			onclick={toggleMenu} 
			aria-expanded={isMenuOpen}
		>
			Mi Cuenta <span class="text-xs ml-1">▼</span>
		</button>

		{#if isMenuOpen}
			<div class="fixed inset-0 z-40 h-screen w-screen" onclick={closeMenu}></div>
			
			<div class="absolute right-0 mt-2 z-50 w-48 rounded-md bg-white py-1 text-gray-800 shadow-xl border border-gray-100 flex flex-col">
				<a 
					
					class="px-4 py-2 text-sm text-left no-underline hover:bg-gray-100 transition-colors"
					onclick={closeMenu}
				>
					Panel de Control
				</a>
				<a 
					
					class="px-4 py-2 text-sm text-left no-underline hover:bg-gray-100 transition-colors"
					onclick={closeMenu}
				>
					Configuración
				</a>
				
				<!--
				<hr class="border-t border-gray-200 my-1" />
				
				<button 
					class="w-full px-4 py-2 text-sm text-left font-medium text-red-600 hover:bg-gray-100 transition-colors cursor-pointer"
					onclick={() => { alert('Cerrando sesión...'); closeMenu(); }}
				>
					Cerrar Sesión
				</button> -->
			</div>
		{/if}
	</div>
</nav>