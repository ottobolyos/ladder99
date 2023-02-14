import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {OgmaLogger, OgmaService} from '@ogma/nestjs-module'

@Injectable()
export class GatewayService {
	constructor(
		private readonly configService: ConfigService,
		@OgmaLogger(GatewayService.name) private readonly logger: OgmaService
	) {}
	getData(): {message: string} {
		return {message: 'Welcome to gateway!'}
	}
}
