import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],

	vite: {
		plugins: [tailwindcss()],
	},
	fonts: {
		families: [
			{
				name: 'MD Sans',
				weights: [
					'100',
					'200',
					'300',
					'400',
					'500',
					'600',
					'700',
					'800',
					'900',
				],
				preload: true,
				provider: 'google',
			},
		],
		defaults: {
			weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
		},
	},
	app: {
		head: {
			title: 'Edubopper',
		},
	},

	modules: ['@nuxt/image', '@nuxt/eslint', '@nuxt/fonts'],
})
