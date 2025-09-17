<script setup lang="ts">
const props = defineProps<{
	// rating from 1 to 5
	rating?: number
}>()

const stars = computed(() => {
	const rating = props.rating || 0
	return Array.from({ length: 5 }, (_, index) => ({
		filled: index < rating,
	}))
})
</script>

<!-- Only show the stars -->
<template>
	<div class="flex flex-row items-center gap-1">
		<label class="text-xs text-gris-800">Fiabilité</label>
		<!-- Star icon, repeat 5 times -->
		<div class="flex flex-row items-center">
			<!-- Based on the rating prop -->
			<div v-for="(star, index) in stars" :key="index" class="relative">
				<img
					src="@/assets/icons/star-filled.svg"
					alt="filled star"
					class="size-3.5"
					:class="{ hidden: !star.filled }"
				/>
				<img
					src="@/assets/icons/star-empty.svg"
					alt="empty star"
					class="size-3.5"
					:class="{ hidden: star.filled }"
				/>
			</div>
		</div>
	</div>
</template>
