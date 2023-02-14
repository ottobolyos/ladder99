import {Controller, Get} from '@nestjs/common'
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'

import {GatewayService} from './gateway.service'

@ApiTags('gateway')
@Controller()
export class GatewayController {
	constructor(private readonly gatewayService: GatewayService) {}

	@ApiOperation({
		description: 'Demo endpoint description',
		summary: 'Demo endpoint',
	})
	@ApiResponse({description: 'Returns `Welcome to gateway!`', status: 200})
	@Get()
	getData(): {message: string} {
		return this.gatewayService.getData()
	}
}
