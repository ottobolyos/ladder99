import {OgmaOptions} from '@ogma/logger'

export type Config = {
	apiPrefix: string
	logLevel: OgmaOptions['logLevel']
	port: number
	swagger: {
		enabled: boolean
		path: string
	}
}
