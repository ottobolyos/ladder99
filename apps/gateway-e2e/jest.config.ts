/* eslint-disable */
export default {
	coverageDirectory: '../../coverage/gateway-e2e',
	displayName: 'gateway-e2e',
	globalSetup: '<rootDir>/src/support/global-setup.ts',
	globalTeardown: '<rootDir>/src/support/global-teardown.ts',
	globals: {},
	moduleFileExtensions: ['ts', 'js', 'html'],
	preset: '../../jest.preset.js',
	setupFiles: ['<rootDir>/src/support/test-setup.ts'],
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', {tsconfig: '<rootDir>/tsconfig.spec.json'}],
	},
}
