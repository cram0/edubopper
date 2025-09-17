<script setup lang="ts">
interface RankingOption {
	label: string
	value: string
}

const props = defineProps<{
	title: string
	options: RankingOption[]
	errorMessage?: string
}>()

const isOpen = ref(false)

const emit = defineEmits<{
	(e: 'submit', value: { ranking: string; average: number }): void
}>()

// Store selected ranking option and average we'll emit
const selectedOption = ref<string | undefined>()
const averageGrade = ref<number | undefined>()

const validateAverageGrade = (e?: Event) => {
	if (e && e.target) {
		const input = e.target as HTMLInputElement
		const value = parseFloat(input.value)

		if (isNaN(value)) {
			averageGrade.value = undefined
			input.value = ''
			return
		}

		if (value < 0) {
			averageGrade.value = 0
			input.value = '0'
		} else if (value > 20) {
			averageGrade.value = 20
			input.value = '20'
		} else {
			averageGrade.value = value
		}
	} else if (averageGrade.value !== undefined) {
		if (isNaN(averageGrade.value)) {
			averageGrade.value = undefined
		} else if (averageGrade.value < 0) {
			averageGrade.value = 0
		} else if (averageGrade.value > 20) {
			averageGrade.value = 20
		}
	}
}

const areAllFieldsSelected = computed(() => {
	return (
		selectedOption.value !== undefined &&
		averageGrade.value !== undefined &&
		averageGrade.value >= 0 &&
		averageGrade.value <= 20
	)
})

const submitSelection = () => {
	if (
		areAllFieldsSelected.value &&
		selectedOption.value &&
		averageGrade.value !== undefined
	) {
		emit('submit', {
			ranking: selectedOption.value,
			average: averageGrade.value,
		})
		isOpen.value = false
	}
}
</script>

<template>
	<div class="bg-white border border-white p-5 rounded-2xl">
		<div
			class="flex flex-row justify-between items-center"
			@click.prevent="isOpen = !isOpen"
		>
			<span class="text-base font-semibold">{{ props.title }}</span>
			<div class="flex flex-row items-center">
				<span
					v-if="props.errorMessage && !areAllFieldsSelected"
					class="text-sm/relaxed text-gris-600"
				>
					{{ props.errorMessage }}
				</span>
				<img
					src="@/assets/icons/chevron-down.svg"
					class="size-4 inline-block"
					:class="{ 'rotate-180': isOpen }"
				/>
			</div>
		</div>

		<div v-if="isOpen">
			<!-- Moyenne generale input -->
			<div class="mt-4">
				<div class="flex flex-row justify-between items-center">
					<span class="font-medium text-gris-900">Moyenne générale</span>
					<input
						v-model.number="averageGrade"
						type="number"
						min="0"
						max="20"
						step="1"
						placeholder="0"
						class="w-20 text-right bg-gris-100 rounded-full px-4 py-2"
						@input="validateAverageGrade"
					/>
				</div>
			</div>

			<!-- Ranking options -->
			<div v-if="props.options && props.options.length > 0">
				<div class="mt-4 border-t border-gris-200 pt-4">
					<h4 class="text-sm font-medium text-gris-900 mb-4">Ton classement</h4>
					<div class="flex flex-wrap gap-2">
						<button
							v-for="option in props.options"
							:key="option.value"
							class="px-4 py-2 w-full border text-gris-900 rounded-3xl"
							:class="
								selectedOption === option.value
									? 'bg-transparent border-gris-900'
									: 'bg-gris-100 border-transparent'
							"
							@click.prevent="
								() => {
									if (selectedOption !== option.value) {
										selectedOption = option.value
									}
								}
							"
						>
							{{ option.label }}
						</button>
					</div>
				</div>
			</div>

			<!-- Submit button -->
			<div v-if="props.options && props.options.length > 0" class="mt-6">
				<EDButton
					variant="primary"
					full-width
					:disabled="!areAllFieldsSelected"
					@click="submitSelection"
				>
					Confirmer
				</EDButton>
			</div>

			<div />
		</div>

		<!-- Show selected values when closed -->
		<div
			v-if="!isOpen && (averageGrade !== undefined || selectedOption)"
			class="flex flex-col gap-1 text-gris-600"
		>
			<div v-if="averageGrade !== undefined" class="mt-2">
				<span>Moyenne: {{ averageGrade }}/20</span>
			</div>
			<div v-if="selectedOption">
				<span>{{
					props.options.find((opt) => opt.value === selectedOption)?.label
				}}</span>
			</div>
		</div>
	</div>
</template>
