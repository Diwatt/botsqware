import type { HttpResponse, SessionCreateRequest, SessionUpdateRequest } from '../Api/WahaClient';
import { Api } from '../Api/WahaClient';
import type { AppConfig } from '../Core/AppConfig';
import type { AppLogger } from '../Core/AppLogger';

export class WahaProvider {
    public readonly client: Api<unknown>;

    public declare sendSeen: (chatId: string) => Promise<void>;
    public declare startTyping: (chatId: string) => Promise<void>;
    public declare stopTyping: (chatId: string) => Promise<void>;
    public declare sendText: (payload: { chatId: string; text: string }) => Promise<void>;
    public declare setReaction: (payload: { chatId: string; messageId: string; reaction: string }) => Promise<void>;

    private constructor(
        private readonly appConfig: AppConfig,
        private readonly appLogger: AppLogger,
    ) {
        this.client = new Api({
            baseUrl: this.appConfig.wahaBaseUrl,
            securityWorker: () => ({ headers: { 'X-Api-Key': this.appConfig.wahaApiKey } }),
        });
    }

    public async getServerEnvironment() {
        const response = await this.client.api.serverControllerGet();
        return response.data;
    }

    public async getSessionInfo(sessionName?: string) {
        const targetSession = sessionName ?? this.appConfig.wahaSession;
        const response = await this.client.api.sessionsControllerGet(targetSession);

        return response.data;
    }

    public async getServerVersion() {
        const response = await this.client.api.versionControllerGet();
        return response.data;
    }

    public async createSession(payload: SessionCreateRequest) {
        const response = await this.client.api.sessionsControllerCreate(payload);

        return response.data;
    }

    public async updateSession(sessionName: string, payload: SessionUpdateRequest) {
        const response = await this.client.api.sessionsControllerUpdate(sessionName, payload);

        return response.data;
    }

    public static create(appConfig: AppConfig, appLogger: AppLogger): WahaProvider {
        const instance = new WahaProvider(appConfig, appLogger);

        return new Proxy(instance, {
            get(target, prop: string) {
                if (prop in target) {
                    return Reflect.get(target, prop);
                }

                const targetMethodName = target.findMethod(prop);
                if (!targetMethodName) {
                    return undefined;
                }

                return async (payload: unknown) => target.executeProxyMethod(prop, targetMethodName, payload);
            },
        });
    }

    private findMethod(prop: string): string | undefined {
        const api = this.client.api as unknown as Record<string, unknown>;
        const normalized = prop.toLowerCase();

        // Build a list of candidate suffixes/variants to match common verb synonyms used
        // by the generated API method names (e.g. "send", "set", "start", "stop", etc).
        const variants = [
            normalized,
            `send${normalized}`,
            `set${normalized}`,
            `start${normalized}`,
            `stop${normalized}`,
            `get${normalized}`,
            `create${normalized}`,
            `update${normalized}`,
        ].map((v) => v.toLowerCase());

        const keys = Object.keys(api);

        // First, prefer methods whose name endsWith one of the candidate variants.
        for (const key of keys) {
            const lower = key.toLowerCase();
            if (variants.some((v) => lower.endsWith(v))) {
                return key;
            }
        }

        // Fallback: try looser matches (endsWith original prop or contains it).
        for (const key of keys) {
            const lower = key.toLowerCase();
            if (lower.endsWith(normalized) || lower.includes(normalized)) {
                return key;
            }
        }

        return undefined;
    }

    private async executeProxyMethod(prop: string, targetMethodName: string, payload: unknown): Promise<unknown> {
        type ApiMethod = (payload: unknown) => Promise<HttpResponse<unknown, unknown>>;
        const api = this.client.api as unknown as Record<string, ApiMethod>;
        const method = api[targetMethodName];

        if (!method) {
            return;
        }

        try {
            const finalPayload = this.buildPayload(payload);
            const response = await method(finalPayload);

            return response.data;
        } catch (error: unknown) {
            return this.handleError(prop, error);
        }
    }

    private buildPayload(payload: unknown): Record<string, unknown> {
        if (typeof payload === 'string') {
            return { session: this.appConfig.wahaSession, chatId: payload };
        }

        if (typeof payload === 'object' && payload !== null) {
            return { session: this.appConfig.wahaSession, ...payload };
        }

        return { session: this.appConfig.wahaSession };
    }

    private handleError(methodName: string, error: unknown): void {
        const httpError = error as HttpResponse<unknown, unknown>;
        const status = httpError?.status;
        const payloadError = httpError?.error ?? error;

        if (error instanceof Error && /ECONNREFUSED/.test(error.message)) {
            this.appLogger.sys.error('WAHA API connection refused', {
                method: methodName,
                message: error.message,
            });
            return;
        }

        this.appLogger.sys.warn(`WAHA API Error on [${methodName}]`, {
            status,
            error: payloadError,
        });
    }
}
