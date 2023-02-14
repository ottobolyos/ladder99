import {Injectable, OnModuleDestroy} from '@nestjs/common'
import {OgmaLogger, OgmaService} from '@ogma/nestjs-module'
import {Subject} from 'rxjs'

@Injectable()
export class ExitAppService implements OnModuleDestroy {
	constructor(
		@OgmaLogger(ExitAppService.name) private readonly logger: OgmaService
	) {}

	readonly #shutdownListener$: Subject<void> = new Subject()

	/** Execute some operations in order to cleanly shut the app down */
	async onModuleDestroy(): Promise<void> {
		this.logger.info('Starting shutdown operations ...')
		this.logger.info('Shutdown operations finished.')
	}

	/** Subscribe to the shutdown listener */
	subscribeToShutdown(shutdownFn: () => void): void {
		this.#shutdownListener$.subscribe(() => shutdownFn())
	}

	/** Emit the shutdown event */
	shutdown(): void {
		this.#shutdownListener$.next()
	}
}
