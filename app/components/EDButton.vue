<script setup lang="ts">
interface Props {
	variant?: 'primary' | 'secondary' | 'option-selected' | 'option-unselected'
	size?: 'sm' | 'md' | 'lg'
	disabled?: boolean
	fullWidth?: boolean
	type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'primary',
	size: 'lg',
	disabled: false,
	fullWidth: false,
	type: 'button',
})

const emit = defineEmits<{
	(e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
	if (!props.disabled) {
		emit('click', event)
	}
}

const buttonClasses = computed(() => {
	const baseClasses = 'border font-medium transition-colors'

	const variantClasses = {
		primary: props.disabled
			? 'bg-white text-gris-200 cursor-not-allowed border-gris-200'
			: 'bg-gris-900 text-white cursor-pointer border-transparent',
		secondary: 'bg-white text-gris-900 border-gris-300 hover:border-gris-900',
		'option-selected': 'bg-transparent border-gris-900 text-gris-900',
		'option-unselected': 'bg-white border-gris-200 text-gris-900',
	}

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm rounded-2xl',
		md: 'px-4 py-2 text-base rounded-3xl',
		lg: 'px-6 py-4 text-base rounded-full',
	}

	const widthClasses = props.fullWidth ? 'w-full' : ''

	console.log('buttonClasses :', {
		baseClasses,
		variantClasses: variantClasses[props.variant],
		sizeClasses: sizeClasses[props.size],
		widthClasses,
	})

	return [
		baseClasses,
		variantClasses[props.variant],
		sizeClasses[props.size],
		widthClasses,
	]
		.filter(Boolean)
		.join(' ')
})
</script>

<template>
	<button
		:type="props.type"
		:disabled="props.disabled"
		:class="buttonClasses"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
