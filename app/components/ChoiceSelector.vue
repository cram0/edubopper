<script setup lang="ts">
// Affiche le titre de la sous option si elle est définie
interface SelectorOptionGroup {
	title?: string
	options: string[]
}

const props = defineProps<{
	title: string
	options: (string[] | SelectorOptionGroup)[]
	errorMessage?: string
}>()

const isOpen = ref(false)

const emit = defineEmits<{
	(e: 'submit', value: Record<number, string | undefined>): void
}>()

const selectedOptions = ref<Record<number, string | undefined>>({})

const areAllOptionsSelected = computed(() => {
	if (!props.options || props.options.length === 0) return false
	return props.options.every(
		(_, index) => selectedOptions.value[index] !== undefined
	)
})

const submitSelections = () => {
	if (areAllOptionsSelected.value) {
		emit('submit', selectedOptions.value)
		isOpen.value = false
	}
}

const getGroupOptions = (group: string[] | SelectorOptionGroup): string[] => {
	return Array.isArray(group) ? group : group.options
}

const getGroupTitle = (
	group: string[] | SelectorOptionGroup
): string | undefined => {
	return Array.isArray(group) ? undefined : group.title
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
				<span class="text-sm/relaxed text-gris">{{
					props.errorMessage ?? props.errorMessage
				}}</span>
				<img
					src="@/assets/icons/chevron-down.svg"
					class="size-4 inline-block ml-2"
					:class="{ 'rotate-180': isOpen }"
				/>
			</div>
		</div>

		<div v-if="isOpen">
			<!-- Each sub-array represents a choice group -->
			<div v-if="props.options && props.options.length > 0">
				<div
					v-for="(group, groupIndex) in props.options"
					:key="groupIndex"
					class="mt-4"
					:class="{ 'border-t border-gris-200 pt-4': groupIndex > 0 }"
				>
					<!-- Optional group title -->
					<p
						v-if="getGroupTitle(group)"
						class="text-sm font-medium text-gris-900 mb-4"
					>
						{{ getGroupTitle(group) }}
					</p>
					<div class="flex flex-wrap gap-2">
						<button
							v-for="option in getGroupOptions(group)"
							:key="option"
							class="px-4 py-2 border text-gris-900 rounded-3xl"
							:class="
								selectedOptions[groupIndex] === option
									? 'bg-transparent border-gris-900'
									: 'bg-gris-100 border-transparent'
							"
							@click.prevent="
								() => {
									if (selectedOptions[groupIndex] !== option) {
										selectedOptions[groupIndex] = option
									}
								}
							"
						>
							{{ option }}
						</button>
					</div>
				</div>
			</div>

			<!-- Submit button -->
			<div v-if="props.options && props.options.length > 0" class="mt-6">
				<EDButton
					variant="primary"
					full-width
					:disabled="!areAllOptionsSelected"
					@click="submitSelections"
				>
					Confirmer
				</EDButton>
			</div>

			<!-- Optional content -->
			<div />
		</div>

		<!-- Show selected options -->
		<div v-if="!isOpen" class="flex gap-1 text-gris">
			<div v-for="(option, index) in selectedOptions" :key="index" class="mt-2">
				<span>{{ option }}</span>
				<span v-if="index < Object.keys(selectedOptions).length - 1">,</span>
			</div>
		</div>
	</div>
</template>
