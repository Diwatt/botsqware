import { setTimeout as sleep } from 'node:timers/promises';
import type { AppConfig } from '../Core/AppConfig';
import type { AppLogger } from '../Core/AppLogger';
import type { HttpResponse, SessionCreateRequest, SessionInfo } from './WahaClient';
import type { WahaProvider } from './WahaProvider';

export class WahaConfigurator {
    private static readonly wahaConnectionFailurePattern = /ECONNREFUSED|ECONNRESET|ENOTFOUND/i;
    private readonly maxRetries = 5;

    private readonly retryDelayMs = 2000;

    public constructor(
        private readonly appConfig: AppConfig,
        private readonly appLogger: AppLogger,
        private readonly wahaProvider: WahaProvider,
    ) {}

    public async ensureSession(): Promise<void> {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                await this.initializeSession();
                return;
            } catch (error: unknown) {
                const shouldRetry = this.handleInitializationError(error, attempt);
                if (!shouldRetry) {
                    return;
                }
                await sleep(this.retryDelayMs);
            }
        }
    }

    private async initializeSession(): Promise<void> {
        await this.ensureServerReady();

        const env = await this.wahaProvider.getServerEnvironment();
        const isNoweb = env.engine === 'NOWEB';

        if (!isNoweb) {
            return;
        }

        const session = this.appConfig.wahaSession;

        let sessionInfo: SessionInfo | null = null;

        try {
            sessionInfo = (await this.wahaProvider.getSessionInfo(session)) as SessionInfo;
        } catch (error: unknown) {
            const httpError = error as HttpResponse<unknown, unknown>;
            if (httpError?.status !== 404) {
                throw error;
            }
        }

        if (!sessionInfo) {
            await this.createSession(session);
            return;
        }

        await this.ensureStore(session, sessionInfo);
    }

    private async ensureStore(session: string, sessionInfo: SessionInfo): Promise<void> {
        if (this.isStoreFullyEnabled(sessionInfo)) {
            return;
        }

        await this.updateStore(session);
    }

    private async ensureServerReady(): Promise<void> {
        await this.wahaProvider.getServerVersion();
    }

    private isStoreFullyEnabled(sessionInfo: SessionInfo): boolean {
        const store = sessionInfo.config?.noweb?.store;
        return store?.enabled === true && store?.fullSync === true;
    }

    private handleInitializationError(error: unknown, attempt: number): boolean {
        if (this.isConnectionFailure(error) && attempt < this.maxRetries) {
            this.appLogger.sys.warn(`WAHA unavailable, retrying... (${attempt}/${this.maxRetries})`);
            return true;
        }

        this.appLogger.sys.warn('Unable to initialize WAHA session.', { error, attempt, maxRetries: this.maxRetries });
        return false;
    }

    private isConnectionFailure(error: unknown): boolean {
        if (error instanceof Error) {
            return WahaConfigurator.wahaConnectionFailurePattern.test(error.message);
        }

        const httpError = error as HttpResponse<unknown, unknown>;
        return (
            httpError?.error instanceof Error &&
            WahaConfigurator.wahaConnectionFailurePattern.test(httpError.error.message)
        );
    }

    private async createSession(session: string): Promise<void> {
        const payload: SessionCreateRequest = {
            name: session,
            config: {
                noweb: {
                    markOnline: true,
                    store: {
                        enabled: true,
                        fullSync: true,
                    },
                },
            },
        };

        await this.wahaProvider.createSession(payload);
        this.appLogger.sys.info('WAHA session created successfully.', { session });
    }

    private async updateStore(session: string): Promise<void> {
        const payload = {
            config: {
                noweb: {
                    markOnline: true,
                    store: {
                        enabled: true,
                        fullSync: true,
                    },
                },
            },
        };

        await this.wahaProvider.updateSession(session, payload);
        this.appLogger.sys.info('WAHA session configuration updated with NOWEB store enabled.', { session });
    }
}