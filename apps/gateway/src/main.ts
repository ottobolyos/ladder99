import {ValidationPipe} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {NestFactory} from '@nestjs/core'
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import {OgmaService} from '@ogma/nestjs-module'
import {SwaggerTheme} from 'swagger-themes'

import {GatewayModule} from './gateway/gateway.module'
import {version} from '../../../package.json'

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestFastifyApplication>(
		GatewayModule,
		new FastifyAdapter()
	)

	// Validate API input
	app.useGlobalPipes(new ValidationPipe())

	// Use Ogma logger
	const logger = app.get<OgmaService>(OgmaService)
	app.useLogger(logger)

	// Get `.env` config
	const config = app.get<ConfigService>(ConfigService)
	const apiPrefix = config.get('apiPrefix')
	const port = config.get('port')

	app.setGlobalPrefix(apiPrefix)

	// Subscribe to your service's shutdown event, run `gateway.close()` when emitted
	app.enableShutdownHooks()

	// Enable and configure Swagger
	if (config.get('swagger.enabled')) {
		SwaggerModule.setup(
			`${config.get('apiPrefix')}/${config.get('swagger.path')}`,
			app,
			SwaggerModule.createDocument(
				app,
				new DocumentBuilder()
					.setDescription('API description of `@ladder99/gateway`')
					.setTitle('Ladder99 Gateway')
					.setVersion(version)
					// .addTag('Ladder99', 'Some tag')
					.addTag('gateway', 'Some tag')
					.addServer(`http://localhost:${port}`)
					.build()
			),
			{
				// Use dark Swagger theme
				customCss: new SwaggerTheme('v3').getBuffer('dark'),
				explorer: true,
			}
		)
	}

	// Start the gateway
	await app.listen(port, '0.0.0.0')

	logger.log(
		`Application is running on: http://localhost:${port}/${apiPrefix}`,
		{context: '🚀'}
	)
}

bootstrap().catch(e => console.log(e))
