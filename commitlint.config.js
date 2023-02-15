const {existsSync, readdirSync} = require('node:fs')

const appsLibsFolders = ['apps', 'libs']
let appsLibsScopes = [null]

appsLibsFolders.forEach(f => {
	if (existsSync(f)) {
		readdirSync(f, {withFileTypes: true})
			.filter(dirent => dirent.isDirectory())
			.map(dirent => dirent.name)
			.forEach(s => {
				if (existsSync(`${f}/${s}/src`)) {
					const modules = readdirSync(`${f}/${s}/src`, {withFileTypes: true})
						.filter(dirent => dirent.isDirectory())
						.map(dirent => dirent.name)

					appsLibsScopes.push(s, ...modules.map(m => `${s}|${m}`))
				} else {
					appsLibsScopes.push(s)
				}
			})
	}
})

const typesEnum = [
	// Commits which affect build components (e.g. build tool, CI pipeline, dependencies, project version), miscellaneous commits (e.g. modifying `.gitignore`), or or other dev tools related stuff, not related to the code itself
	'chore',

	// Commits, that affect documentation only
	'docs',

	// Commits, that adds a new feature (minor version bump)
	'feat',

	// Commits that fix a bug (patch version bump)
	'fix',

	// Commits which are special `refactor` commits, that improve performance
	'perf',

	// Commits, that rewrite/restructure your code, however does not change any behaviour
	'refactor',

	// Commits that revert previous commits
	'revert',

	// Commits, that do not affect the meaning (white-space, formatting, missing semi-colons, etc)
	'style',

	// Commits, that add missing tests or correcting existing tests
	'test',
]

const typesEnumScoped = {
	chore: [null, 'build', 'ci', 'deps'],
	docs: [],
	...typesEnum
		.filter(i => i !== 'chore' && i !== 'docs')
		.reduce(
			(a, c) => ({
				...a,
				[c]: c === 'style' ? [...appsLibsScopes, 'docs'] : appsLibsScopes,
			}),
			{}
		),
}

module.exports = {
	extends: ['@commitlint/config-conventional'],
	formatter: '@commitlint/format',
	// TODO: Change this URL to our Wiki page with the description of the commit message format.
	helpUrl:
		'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
	parserPreset: {
		parserOpts: {
			issuePrefixes: ['#'],
		},
	},
	plugins: ['selective-scope'],
	rules: {
		'body-case': [2, 'always', 'sentence-case'],
		'body-empty': [0, 'never'],
		'body-full-stop': [2, 'always', '.'],
		'body-leading-blank': [2, 'always'],
		'body-max-line-length': [0, 'never', 0],
		'footer-empty': [0, 'never'],
		'footer-leading-blank': [2, 'always'],
		'footer-max-line-length': [0, 'never', 0],
		'header-full-stop': [2, 'never', '.'],
		'header-max-length': [0, 'never', 0],
		'scope-enum': [
			2,
			'always',
			[...appsLibsScopes, 'docs'].filter(i => i !== null),
		],
		'selective-scope': [2, 'always', typesEnumScoped],
		'subject-case': [1, 'always', 'lower-case'],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [2, 'never', '.'],
		'type-case': [2, 'always', 'lower-case'],
		'type-enum': [2, 'always', typesEnum],
	},
}
