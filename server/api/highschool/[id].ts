import { getHighschoolById, getBacTypes } from '@@/server/db/highschool'

export default defineEventHandler(async (event) => {
	const { id } = event.context.params as { id: string }
	const highschoolId = parseInt(id)

	if (isNaN(highschoolId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid highschool ID',
		})
	}

	const highschool = getHighschoolById(highschoolId)

	if (!highschool) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Highschool not found',
		})
	}

	return {
		data: { highschool, bacTypes: getBacTypes(highschoolId) },
	}
})
