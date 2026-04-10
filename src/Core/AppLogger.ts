import { dirname, join } from 'node:path';
import type { Transform } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { createCustomTransport } from '@mastra/core/logger';
import { PinoLogger } from '@mastra/loggers';
import pino from 'pino';

import type { AppConfig } from './AppConfig';

const PINO_PRETTY_APP_TRANSPORT = join(dirname(fileURLToPath(import.meta.url)), 'PinoPrettyAppTransport.mjs');

export class AppLogger {
    public readonly llm: PinoLogger;

    public readonly sys: PinoLogger;

    private readonly mastraLogger: PinoLogger;

    public constructor(config: AppConfig) {
        const targets: pino.TransportTargetOptions[] = [
            {
                target: PINO_PRETTY_APP_TRANSPORT,
                level: config.logLevel,
                options: {
                    colorize: true,
                    colorizeObjects: true,
                    hideObject: true,
                    ignore: 'pid,hostname,name',
                    singleLine: false,
                    translateTime: 'SYS:standard',
                },
            },
        ];

        if (config.logFilePath !== '') {
            targets.push({
                target: 'pino/file',
                level: config.logLevel,
                options: {
                    append: true,
                    destination: config.logFilePath,
                    mkdir: true,
                },
            });
        }

        const pinoStream = pino.transport({ targets });
        const customTransport = createCustomTransport(pinoStream as unknown as Transform);

        const sharedOptions = {
            level: config.logLevel,
            overrideDefaultTransports: true,
            transports: { default: customTransport },
        };

        this.llm = new PinoLogger({
            ...sharedOptions,
            name: 'llm',
        });

        this.sys = new PinoLogger({
            ...sharedOptions,
            name: 'sys',
        });

        this.mastraLogger = new PinoLogger({
            ...sharedOptions,
            name: 'mastra',
        });
    }

    public getMastraLogger(): PinoLogger {
        return this.mastraLogger;
    }

    public logMastraCode(message: string, ...context: unknown[]): void {
        const meta =
            context.length === 1 && context[0] !== null && typeof context[0] === 'object' && !Array.isArray(context[0])
                ? (context[0] as Record<string, unknown>)
                : { context };
        this.mastraLogger.info(message, meta);
    }
}
