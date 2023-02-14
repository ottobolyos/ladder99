import {ConfigService} from '@nestjs/config'
import {Test} from '@nestjs/testing'
import {createProviderToken} from '@ogma/nestjs-module'

import {GatewayService} from './gateway.service'

describe('GatewayService', () => {
	let service: GatewayService

	beforeAll(async () => {
		const app = await Test.createTestingModule({
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

		service = app.get<GatewayService>(GatewayService)
	})

	describe('getData', () => {
		it('should return "Welcome to gateway!"', () => {
			expect(service.getData()).toEqual({message: 'Welcome to gateway!'})
		})
	})
})
