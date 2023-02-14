import {Module} from '@nestjs/common'
import {OgmaOptions} from '@ogma/logger'
import {OgmaModule} from '@ogma/nestjs-module'
import {FastifyParser} from '@ogma/platform-fastify'

import {AppController} from './controller/app.controller'
import {ExitAppService} from './service/exit-app.service'

@Module({
	controllers: [AppController],
	exports: [ExitAppService],
	imports: [
		OgmaModule.forRoot({
			interceptor: {
				http: FastifyParser,
			},
			service: {
				application: 'gateway/app',
				color: true,
				each: true,
				json: false,
				logLevel:
					(process.env.L99_LOG_LEVEL as OgmaOptions['logLevel']) || 'WARN',
			},
		}),
		OgmaModule.forFeatures([ExitAppService.name]),
	],
	providers: [ExitAppService],
})
export class AppModule {}
