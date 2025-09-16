import type { Config } from 'prettier'

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config: Config = {
	trailingComma: 'es5',
	tabWidth: 2,
	printWidth: 80,
	semi: false,
	useTabs: true,
	singleQuote: true,
}

export default config
