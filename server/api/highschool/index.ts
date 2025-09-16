import { getAllHighschools } from '@@/server/db/highschool'

export default defineEventHandler(async () => {
	const highschools = getAllHighschools()
	return { data: highschools }
})
