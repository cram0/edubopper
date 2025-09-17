<template>
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
	>
		<div
			class="size-12 border-4 border-white/30 border-t-orange-500 rounded-full animate-spin"
		/>
	</div>
</template>

<style scoped>
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.animate-spin {
	animation: spin 1s linear infinite;
}
</style>
