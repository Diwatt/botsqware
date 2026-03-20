import type { ConsolaInstance } from 'consola';
import { createConsola, LogLevels } from 'consola';

import type { AppConfig } from './AppConfig';

export class AppLogger {
    public readonly sys: ConsolaInstance;

    public constructor(config: AppConfig) {
        // Consola handles pretty-print in dev and JSON output in prod.
        this.sys = createConsola({
            level: LogLevels[config.logLevel],
        });
    }
}
