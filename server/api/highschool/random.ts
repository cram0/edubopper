import { getBacTypes, getRandomHighschool } from '@@/server/db/highschool'

export default defineEventHandler(async () => {
	const highschool = getRandomHighschool()
	return { data: { highschool, bacTypes: getBacTypes(highschool.id) } }
})
