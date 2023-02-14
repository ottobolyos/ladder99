import {Controller, Put} from '@nestjs/common'
import {ApiOperation, ApiTags} from '@nestjs/swagger'

import {ExitAppService} from '../service/exit-app.service'

@ApiTags('gateway', 'app')
@Controller('app')
export class AppController {
	constructor(private readonly exitAppService: ExitAppService) {}

	@ApiOperation({
		description: 'Cleanly exit the app',
		summary: 'Exit the app',
	})
	@Put('exit')
	exitApp(): void {
		this.exitAppService.shutdown()
	}
}
