import dotenv from 'dotenv';
import { z } from 'zod';

import { ApplicationConfigurationException } from '../Exception';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

const EnvSchema = z.object({
    allowedGroupId: z.string().default(''),
    logLevel: z
        .string()
        .refine((value): value is LogLevel => LOG_LEVELS.includes(value as LogLevel), {
            message: 'logLevel must be a valid pino log level',
        })
        .default('info'),
    logFilePath: z.string().default(''),
    llmApiKey: z.string().default(''),
    llmChatUrl: z.string().url().default('https://api.minimax.io/anthropic'),
    llmEmbeddingUrl: z.string().url().default('https://api.minimax.io/v1'),
    llmModel: z.string().default('MiniMax-M2.7'),
    port: z.coerce.number().int().positive().default(8000),
    wahaBaseUrl: z.string().url().default('http://localhost:3000'),
    wahaApiKey: z.string().default(''),
    wahaSession: z.string().default('default'),
    postgresHost: z.string().default('localhost'),
    postgresPort: z.coerce.number().int().positive().default(5432),
    postgresUser: z.string().default('botsware'),
    postgresPassword: z.string().default('password'),
    postgresDb: z.string().default('botsware'),
    directusUrl: z.string().url().default('http://localhost:8055'),
    directusToken: z.string().default(''),
});

export type AppSettings = z.infer<typeof EnvSchema>;
export type AppLogLevel = LogLevel;

export class AppConfig implements AppSettings {
    public readonly allowedGroupId: string = '';
    public readonly logLevel: AppLogLevel = 'info';
    public readonly logFilePath: string = '';
    public readonly llmApiKey: string = '';
    public readonly llmChatUrl: string = '';
    public readonly llmEmbeddingUrl: string = '';
    public readonly llmModel: string = '';
    public readonly port: number = 8000;
    public readonly wahaBaseUrl: string = '';
    public readonly wahaApiKey: string = '';
    public readonly wahaSession: string = '';
    public readonly postgresHost: string = 'localhost';
    public readonly postgresPort: number = 5432;
    public readonly postgresUser: string = 'botsware';
    public readonly postgresPassword: string = 'password';
    public readonly postgresDb: string = 'botsware';
    public readonly directusUrl: string = 'http://localhost:8055';
    public readonly directusToken: string = '';

    public constructor() {
        dotenv.config();

        const rawEnv = {
            allowedGroupId: process.env.GROUP_ID,
            logLevel: process.env.LOG_LEVEL,
            logFilePath: process.env.LOG_FILE,
            llmApiKey: process.env.LLM_API_KEY,
            llmChatUrl: process.env.LLM_CHAT_URL,
            llmEmbeddingUrl: process.env.LLM_EMBEDDING_URL,
            llmModel: process.env.LLM_MODEL,
            port: process.env.PORT,
            wahaBaseUrl: process.env.WAHA_BASE_URL,
            wahaApiKey: process.env.WAHA_API_KEY,
            wahaSession: process.env.WAHA_SESSION,
            postgresHost: process.env.POSTGRES_HOST,
            postgresPort: process.env.POSTGRES_PORT,
            postgresUser: process.env.POSTGRES_USER,
            postgresPassword: process.env.POSTGRES_PASSWORD,
            postgresDb: process.env.POSTGRES_DB,
            directusUrl: process.env.DIRECTUS_URL,
            directusToken: process.env.DIRECTUS_ADMIN_TOKEN,
        };

      const parsed = EnvSchema.safeParse(rawEnv);

        if (!parsed.success) {
            const errorMessage = parsed.error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ');

            throw new ApplicationConfigurationException(`Invalid environment configuration: ${errorMessage}`);
        }

        this.allowedGroupId = parsed.data.allowedGroupId;
        this.logLevel = parsed.data.logLevel;
        this.logFilePath = parsed.data.logFilePath;
        this.llmApiKey = parsed.data.llmApiKey;
        this.llmChatUrl = parsed.data.llmChatUrl.replace(/\/+$/, '');
        this.llmEmbeddingUrl = parsed.data.llmEmbeddingUrl.replace(/\/+$/, '');
        this.llmModel = parsed.data.llmModel;
        this.port = parsed.data.port;
        this.wahaBaseUrl = parsed.data.wahaBaseUrl.replace(/\/+$/, '');
        this.wahaApiKey = parsed.data.wahaApiKey;
        this.wahaSession = parsed.data.wahaSession;
        this.postgresHost = parsed.data.postgresHost;
        this.postgresPort = parsed.data.postgresPort;
        this.postgresUser = parsed.data.postgresUser;
        this.postgresPassword = parsed.data.postgresPassword;
        this.postgresDb = parsed.data.postgresDb;
        this.directusUrl = parsed.data.directusUrl;
        this.directusToken = parsed.data.directusToken;
    }

    public get databaseUrl(): string {
        return `postgresql://${this.postgresUser}:${this.postgresPassword}@${this.postgresHost}:${this.postgresPort}/${this.postgresDb}`;
    }
}
