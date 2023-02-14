import {Test, TestingModule} from '@nestjs/testing'
import {createProviderToken} from '@ogma/nestjs-module'

import {ExitAppService} from './exit-app.service'

describe('ExitAppService', () => {
	let service: ExitAppService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ExitAppService,
				{
					provide: createProviderToken('ExitAppService'),
					useValue: {
						info: jest.fn(),
					},
				},
			],
		}).compile()

		service = module.get<ExitAppService>(ExitAppService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	it('should call `onModuleDestroy()`', async () => {
		await service.onModuleDestroy()
	})

	it('should call `subscribeToShutdown()`', async () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		service.subscribeToShutdown(() => {})
	})

	it('should call `shutdown()`', async () => {
		service.shutdown()
	})
})
