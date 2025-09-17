<script setup lang="ts">
interface Props {
	progress: number
	size?: string
	animationDuration?: number // in milliseconds
}

const props = withDefaults(defineProps<Props>(), {
	size: 'size-28',
	animationDuration: 2000
})

// Calculate stroke-dasharray and stroke-dashoffset for the progress circle
const radius = 45
const circumference = 2 * Math.PI * radius

// Animated progress value that starts at 0
const animatedProgress = ref(0)
const progressOffset = computed(() => circumference * (1 - animatedProgress.value / 100))

// Animate from 0 to target progress when component mounts or progress changes
const animateProgress = () => {
	animatedProgress.value = 0

	// Use requestAnimationFrame for smooth animation
	const startTime = performance.now()
	const targetProgress = props.progress

	const animate = (currentTime: number) => {
		const elapsed = currentTime - startTime
		const progress = Math.min(elapsed / props.animationDuration, 1)

		// Easing function (ease-out)
		const easedProgress = 1 - Math.pow(1 - progress, 3)

		animatedProgress.value = easedProgress * targetProgress

		if (progress < 1) {
			requestAnimationFrame(animate)
		}
	}

	requestAnimationFrame(animate)
}

// Start animation when component mounts
onMounted(() => {
	animateProgress()
})

// Restart animation when progress prop changes
watch(() => props.progress, () => {
	animateProgress()
})
</script>

<template>
	<div class="relative" :class="size">
		<!-- Circular progress bar -->
		<svg
			:class="[size, 'transform -rotate-90']"
			viewBox="0 0 100 100"
			fill="none"
		>
			<!-- Background circle -->
			<circle
				cx="50"
				cy="50"
				:r="radius"
				stroke="#e5e7eb"
				stroke-width="4"
				fill="none"
			/>
			<!-- Progress circle with gradient -->
			<circle
				cx="50"
				cy="50"
				:r="radius"
				stroke="url(#progressGradient)"
				stroke-width="4"
				fill="none"
				stroke-linecap="round"
				:stroke-dasharray="circumference"
				:stroke-dashoffset="progressOffset"
			/>
			<!-- Gradient definition -->
			<defs>
				<linearGradient
					id="progressGradient"
					x1="0%"
					x2="30%"
					y1="100%"
					y2="10%"
				>
					<stop offset="10%" style="stop-color: #b176ff" />
					<stop offset="70%" style="stop-color: #ff7342" />
				</linearGradient>
			</defs>
		</svg>
		<!-- Center content slot -->
		<div class="absolute inset-0 flex items-center justify-center">
			<slot />
		</div>
	</div>
</template>
