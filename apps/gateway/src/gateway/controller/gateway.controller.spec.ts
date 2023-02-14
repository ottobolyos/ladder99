import {ConfigModule, ConfigService} from '@nestjs/config'
import {Test, TestingModule} from '@nestjs/testing'
import {createProviderToken} from '@ogma/nestjs-module'

import {GatewayController} from './gateway.controller'
import {GatewayService} from '../service/gateway.service'

describe('GatewayController', () => {
	let gatewayController: GatewayController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GatewayController],
			imports: [ConfigModule],
			providers: [
				ConfigService,
				GatewayService,
				{
					provide: createProviderToken('GatewayService'),
					useValue: {
						debug: jest.fn(),
						log: jest.fn(),
					},
				},
			],
		}).compile()

		gatewayController = module.get<GatewayController>(GatewayController)
	})

	describe('getData', () => {
		it('should return "Welcome to gateway!"', () => {
			expect(gatewayController.getData()).toEqual({
				message: 'Welcome to gateway!',
			})
		})
	})
})
