<script setup lang="ts">
import type { Highschool } from '@@/types/highschool.ts'

const bacOptions = ref<{
	classes: string[]
	baccalaureatTypes: { label: string; specialities: string[] }[]
	rankingChoices: { label: string; value: string }[]
}>({
	classes: ['Seconde', 'Première', 'Terminale'],

	baccalaureatTypes: [],

	rankingChoices: [
		{ label: '1er de la classe', value: 'first' },
		{ label: 'Dans les 5 premiers', value: 'top5' },
		{ label: 'Autre / Je ne sais pas', value: 'other' },
	],
})

const getAllBaccalaureatNames = () => {
	return bacOptions.value.baccalaureatTypes.map((type) => type.label)
}

const getAllClasses = () => {
	return bacOptions.value.classes
}

// Get speciality options based on selected bac type
const getSpecialityOptionsForSelectedType = computed(() => {
	if (!selectedBacType.value) return []

	const selectedType = bacOptions.value.baccalaureatTypes.find(
		(type) => type.label === selectedBacType.value
	)

	if (!selectedType) return []

	return [
		{
			title: undefined,
			options: selectedType.specialities,
		},
	]
})

const selectedClass = ref<string | null>(null)
const selectedBacType = ref<string | null>(null)
const selectedNotes = ref<Record<string, string | number>>({})

const classSelections = ref<Record<number, string | undefined>>({})
const specialitySelections = ref<Record<number, string | undefined>>({})

const selectedHighschool = ref<Highschool | null>(null)

// Give unique key
const classSelectorKey = computed(() =>
	selectedHighschool.value
		? `class-${selectedHighschool.value.id}`
		: 'class-none'
)

// Give unique key
const specialitySelectorKey = computed(
	() =>
		`${selectedHighschool.value ? selectedHighschool.value.id : 'none'}-${selectedBacType.value ?? 'none'}`
)

const handleClassSelections = (value: Record<number, string | undefined>) => {
	classSelections.value = value
	selectedClass.value = value[0] || null
	const newBacType = value[1] || null

	// If bac type changed, clear specialty selections
	if (newBacType !== selectedBacType.value) {
		specialitySelections.value = {}
	}

	selectedBacType.value = newBacType
}

const handleSpecialitySelections = (
	value: Record<number, string | undefined>
) => {
	specialitySelections.value = value
}

const handleRankingSelection = (value: {
	ranking: string
	average: number
}) => {
	selectedNotes.value['ranking'] = value.ranking
	selectedNotes.value['general'] = value.average
}

const isNotesComplete = computed(() => {
	return selectedNotes.value['ranking'] && selectedNotes.value['general']
})

const isClassComplete = computed(() => {
	return classSelections.value[0] && classSelections.value[1]
})

const isSpecialityComplete = computed(() => {
	return Object.keys(specialitySelections.value).length > 0
})

const handleGetHighschoolInformations = async (hs: Highschool) => {
	const previousId = selectedHighschool.value?.id
	selectedHighschool.value = hs

	const informations = await $fetch(`/api/highschool/${hs.id}`, {
		method: 'get',
	})

	const data = informations.data
	bacOptions.value.baccalaureatTypes = data.bacTypes

	// If the highschool actually changed, reset class & speciality choices
	if (previousId !== hs.id) {
		classSelections.value = {}
		specialitySelections.value = {}
		selectedClass.value = null
		selectedBacType.value = null
	}
}
</script>

<template>
	<div class="flex flex-col gap-4 flex-1">
		<div class="flex flex-col gap-4">
			<HighschoolSelector @submit="handleGetHighschoolInformations" />
			<ChoiceSelector
				:key="classSelectorKey"
				title="Classe"
				:error-message="!isClassComplete ? 'À completer' : undefined"
				:options="[
					getAllClasses(),
					{ title: 'Type de bac', options: getAllBaccalaureatNames() },
				]"
				@submit="handleClassSelections"
			/>
			<ChoiceSelector
				:key="`specialities-${specialitySelectorKey}`"
				title="Spécialités"
				:error-message="!isSpecialityComplete ? 'À completer' : undefined"
				:options="getSpecialityOptionsForSelectedType"
				@submit="handleSpecialitySelections"
			/>
			<RankingSelector
				title="Notes"
				:error-message="!isNotesComplete ? 'À completer' : undefined"
				:options="bacOptions.rankingChoices"
				@submit="handleRankingSelection"
			/>
		</div>

		<div class="flex flex-col-reverse lg:flex-col items-center grow p-2 lg:p-4">
			<EDButton
				variant="primary"
				:disabled="
					!isClassComplete || !isSpecialityComplete || !isNotesComplete
				"
				@click="
					() => {
						console.log('Submitted!')
					}
				"
			>
				Confirmer
			</EDButton>
		</div>
	</div>
</template>
