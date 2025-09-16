<script setup lang="ts">
import type { Highschool, HighschoolResponse } from '@@/types/highschool.ts'

const {
	data: hsData,
	pending,
	error,
} = await useFetch<HighschoolResponse>('/api/highschool', { method: 'get' })

// Open search bar
const isExpanded = ref(false)

const props = defineProps<{
	modelValue?: Highschool | null
}>()

const emit = defineEmits<{
	(e: 'submit', value: Highschool): void
}>()

const localSelectedName = ref<string | null>(null)
const displayedHighschool = computed(() =>
	props.modelValue?.name || localSelectedName.value || 'Error'
)

// Debouncing
const searchQuery = ref('')
const debouncedQuery = ref('')
const minQueryLength = 2
let debounceHandle: number | undefined

const highschoolList = computed<Highschool[]>(() => hsData.value?.data ?? [])
const hasError = computed(() => Boolean(error.value))

const normalize = (s: unknown) =>
	String(s ?? '')
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')

const filtered = computed<Highschool[]>(() => {
	if (debouncedQuery.value.length < minQueryLength) return []

	const q = normalize(debouncedQuery.value)

	return highschoolList.value.filter((hs: Highschool) =>
		normalize(hs.name).includes(q)
	)
})

const selectHighschool = (hs: Highschool) => {
	// Update parent model and keep a local fallback name
	localSelectedName.value = hs.name
	emit('submit', hs)
	isExpanded.value = false
	searchQuery.value = ''
	debouncedQuery.value = ''
}

watch(searchQuery, (val) => {
	if (debounceHandle) clearTimeout(debounceHandle)
	debounceHandle = setTimeout(() => {
		debouncedQuery.value = val.trim()
	}, 300)
})

onUnmounted(() => {
	if (debounceHandle) clearTimeout(debounceHandle)
})
</script>

<template>
	<div>
		<div
			v-if="isExpanded"
			class="z-[9999] inset-0 bg-black/70 fixed pt-10"
			@click.self="isExpanded = false"
		>
			<div class="mx-auto w-3/4 max-w-3xl flex flex-col">
				<div class="relative flex items-center">
					<img
						src="@/assets/icons/search.svg"
						class="absolute left-4 size-4 text-white"
						aria-hidden="true"
					>
					<input
						v-model="searchQuery"
						class="text-gris-900 w-full bg-beige p-4 pl-10 rounded-full"
						placeholder="Rechercher un lycée"
						autocomplete="off"
					>
				</div>
				<div
					class="mt-3 bg-beige rounded-3xl max-h-[50vh] overflow-y-auto shadow-lg"
				>
					<div v-if="pending" class="p-4 text-center text-gris-900">
						Chargement…
					</div>
					<div v-else-if="hasError" class="p-4 text-center text-red-500">
						Erreur de chargement
					</div>
					<div
						v-else-if="debouncedQuery.length < 2"
						class="p-4 text-center text-gris-900"
					>
						Tape au moins 2 caractères pour rechercher
					</div>
					<template v-else>
						<div
							v-if="filtered.length === 0"
							class="p-4 text-center text-gris-900"
						>
							Aucun résultat
						</div>
						<ul v-else class="divide-y divide-beige-border">
							<li v-for="hs in filtered" :key="hs.id">
								<button
									class="w-full text-left px-6 py-4 rounded-xl hover:cursor-pointer"
									@click="selectHighschool(hs)"
								>
									<span class="font-medium text-gris-900">{{ hs.name }}</span>
								</button>
							</li>
						</ul>
					</template>
				</div>
			</div>
		</div>
		<div
			class="from-[#ff7342] to-[#b176ff] from-60% to-100% bg-gradient-to-r rounded-2xl p-5"
		>
			<div class="flex flex-col gap-6">
				<div class="text-white flex flex-col gap-2">
					<span class="font-bold text-xl/tight">
						{{ displayedHighschool }}
					</span>
					<div class="flex flex-row gap-2">
						<div class="flex flex-row gap-1 items-center-safe">
							<img src="@/assets/icons/map-pin.svg" class="size-3">
							<span class="text-sm">Lille</span>
						</div>
						<div class="flex flex-row gap-1 items-center-safe">
							<img src="@/assets/icons/building.svg" class="size-3">
							<span class="text-sm">Lycée Public</span>
						</div>
					</div>
				</div>
				<div>
					<button
						class="bg-white text-gris-900 px-4 py-2 rounded-full text-sm cursor-pointer"
						@click.prevent="isExpanded = !isExpanded"
					>
						Modifier
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
