import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],

	vite: {
		plugins: [tailwindcss()],
	},
	fonts: {
		defaults: {
			weights: [400, 500, 600, 700],
		},
	},

	modules: ['@nuxt/image', '@nuxt/eslint', '@nuxt/fonts'],
})