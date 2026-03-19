import type { ConsolaInstance } from 'consola';
import { createConsola } from 'consola';

import type { AppConfig } from './AppConfig';

export class AppLogger {
    private readonly logger: ConsolaInstance;

    public constructor(config: AppConfig) {
        // Consola handles pretty-print in dev and JSON output in prod.
        this.logger = createConsola({
            level: config.settings.logLevel === 'debug' ? 4 : 3,
        });
    }

    // Consola already supports objects, strings, and native errors.
    public debug(message: string, details?: unknown): void {
        this.logger.debug(message, details);
    }

    public info(message: string, details?: unknown): void {
        this.logger.info(message, details);
    }

    public warn(message: string, details?: unknown): void {
        this.logger.warn(message, details);
    }

    public error(message: string, details?: unknown): void {
        this.logger.error(message, details);
    }
}
