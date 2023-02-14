import {Test, TestingModule} from '@nestjs/testing'
import {createProviderToken} from '@ogma/nestjs-module'

import {AppController} from './app.controller'
import {ExitAppService} from '../service/exit-app.service'

describe('AppController', () => {
	let controller: AppController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [
				ExitAppService,
				{
					provide: createProviderToken('AppController'),
					useValue: {},
				},
				{
					provide: ExitAppService,
					useValue: {
						shutdown: jest.fn(),
					},
				},
			],
		}).compile()

		controller = module.get<AppController>(AppController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('should call `exitApp()` method', () => {
		controller.exitApp()
	})
})
