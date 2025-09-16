import type { Highschool } from '@@/types/highschool'

const baccalaureatTypes = [
	{ label: 'General', specialities: ['S', 'ES', 'L'] },
	{ label: 'Technologique', specialities: ['STI2D', 'STMG'] },
	{ label: 'Professionnel', specialities: ['Bac Pro'] },
]

const names = [
	'Etienne Dolet',
	'Lycée privé Charles de Foucauld',
	'Lycée polyvalent Guillaume Tirel',
	"Lycée polyvalent l'Initiative",
	'Lycée polyvalent privé Saint Jean de Montmartre',
	'Lycée privé Pascal',
	'Lycée du bâtiment et des travaux publics',
	'Lycée polyvalent privé Saint-Nicolas',
	'Lycée privé La Rochefoucauld',
	"Lycée technique privé de l'école technique supérieure du laboratoire",
	'Lycée privé Charles Péguy',
	'Lycée privé Sainte-Louise',
	"Lycée privé L'Ecole alsacienne",
	'Lycée polyvalent ESAA-Ecole Boulle',
	'Lycée polyvalent Paul Poiret',
	'Lycée Charlemagne',
	'Lycée Claude Monet',
	'Lycée privé Lucien de Hirsch',
	'Lycée privé Saint-Michel de Picpus',
]

const getAllHighschools: () => Highschool[] = () => {
	return names.map((name, idx) => ({ id: idx + 1, name }))
}
const getHighschoolById: (id: number) => Highschool | null = (id: number) => {
	return names[id - 1] ? { id, name: names[id - 1] } : null
}

const getBacTypes: (
	highschoolId: number
) => { label: string; specialities: string[] }[] = (highschoolId: number) => {
	// use a modulo to pick between 1 and 3 specialities and not use random
	// to keep it deterministic
	const count = (highschoolId % 3) + 1
	const types = []
	for (let i = 0; i < count; i++) {
		types.push(baccalaureatTypes[i])
	}

	return types
}

export { getAllHighschools, getHighschoolById, getBacTypes }
