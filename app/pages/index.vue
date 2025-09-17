<script setup lang="ts">
import type { Highschool } from '@@/types/highschool.ts'

const route = useRoute()

// Loading state
const isLoading = ref(false)

const bacOptions = ref<{
	classes: string[]
	baccalaureatTypes: { label: string; specialities: string[] }[]
	rankingChoices: { label: string; value: string }[]
}>({
	classes: ['Seconde', 'Première', 'Terminale'],

	baccalaureatTypes: [

	],

	rankingChoices: [
		{ label: '1er de la classe', value: 'first' },
		{ label: 'Dans les 5 premiers', value: 'top5' },
		{ label: 'Autre / Je ne sais pas', value: 'other' },
	],
})

const allBaccalaureatNames = computed(() =>
	bacOptions.value.baccalaureatTypes.map((type) => type.label)
)

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

	isLoading.value = true

	try {
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
	} finally {
		isLoading.value = false
	}
}

// If random query parameter is set to true, prefill baccalaureat types with random values
const isRandomMode = route.query.random === "true"

if (isRandomMode) {
	console.log("Random mode: Prefilling baccalaureat types.", route.query);
	isLoading.value = true

	try {
		const response = await useFetch('/api/highschool/random', { method: 'get' });
		const data = response.data.value?.data;
		if (data) {
			console.log("Fetched random highschool data:", data);
			const highschoolData = data as { highschool: Highschool; bacTypes: { label: string; specialities: string[] }[] };
			selectedHighschool.value = highschoolData.highschool;
			bacOptions.value = {
				...bacOptions.value,
				baccalaureatTypes: highschoolData.bacTypes,
			}
		} else {
			console.warn("Failed to fetch random highschool data.");
		}
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<div class="flex flex-col gap-4 flex-1">
		<!-- Loading spinner -->
		<SimpleSpinner v-if="isLoading" />

		<!-- High school selection prompt -->
		<div v-if="!selectedHighschool && !isRandomMode" class="flex flex-col items-center justify-center flex-1 gap-6 p-8">
			<div class="text-center">
				<h1 class="text-2xl font-semibold text-gris-800 mb-2">Bienvenue sur Edubopper</h1>
				<p class="text-gris-600">Pour commencer, modifiez votre lycée</p>
			</div>
			<div class="w-full max-w-md">
				<HighschoolSelector v-model="selectedHighschool" @submit="handleGetHighschoolInformations" />
			</div>
		</div>

		<!-- Main form (shown when highschool is selected OR in random mode) -->
		<div v-else class="flex flex-col gap-4">
			<HighschoolSelector v-model="selectedHighschool" @submit="handleGetHighschoolInformations" />
			<ChoiceSelector
				:key="classSelectorKey"
				title="Classe"
				:error-message="!isClassComplete ? 'À completer' : undefined"
				:options="[
					getAllClasses(),
					{ title: 'Type de bac', options: allBaccalaureatNames },
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

		<div v-if="selectedHighschool || isRandomMode" class="flex flex-col-reverse lg:flex-col items-center grow p-2 lg:p-4">
			<EDButton
				variant="primary"
				:disabled="
					!isClassComplete || !isSpecialityComplete || !isNotesComplete
				"
				@click="
					$router.push({ name: 'result' })
				"
			>
				Confirmer
			</EDButton>
		</div>
	</div>
</template>
