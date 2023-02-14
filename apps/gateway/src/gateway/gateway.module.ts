import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {OgmaOptions} from '@ogma/logger'
import {OgmaModule} from '@ogma/nestjs-module'
import {FastifyParser} from '@ogma/platform-fastify'

import {DEFAULT_CONFIG} from './constant/default-config.constant'
import {GatewayController} from './gateway.controller'
import {GatewayService} from './gateway.service'
import {Config} from './type/config.type'

const envConfig = {
	apiPrefix: process.env.L99_GW_API_PREFIX || DEFAULT_CONFIG.L99_GW_API_PREFIX,
	logLevel: (process.env.L99_GW_LOG_LEVEL ||
		DEFAULT_CONFIG.L99_GW_LOG_LEVEL) as OgmaOptions['logLevel'],
	port: parseInt(process.env.L99_GW_PORT, 10) || DEFAULT_CONFIG.L99_GW_PORT,
	swagger: {
		enabled:
			process.env.L99_GW_ENABLE_SWAGGER === 'true'
				? true
				: process.env.L99_GW_ENABLE_SWAGGER === 'false'
				? false
				: DEFAULT_CONFIG.L99_GW_ENABLE_SWAGGER,
		path: process.env.L99_GW_SWAGGER_PATH || DEFAULT_CONFIG.L99_GW_SWAGGER_PATH,
	},
}

@Module({
	controllers: [GatewayController],
	imports: [
		ConfigModule.forRoot({
			envFilePath: process.env.L99_CONFIG || DEFAULT_CONFIG.DEFAULT_CONFIG_FILE,
			isGlobal: true,
			load: [(): Config => envConfig],
		}),
		OgmaModule.forRoot({
			interceptor: {
				http: FastifyParser,
			},
			service: {
				application: 'gateway',
				color: true,
				each: true,
				json: false,
				logLevel: envConfig.logLevel,
			},
		}),
		OgmaModule.forFeatures([GatewayService.name]),
	],
	providers: [GatewayService],
})
export class GatewayModule {}
