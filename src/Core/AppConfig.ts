import type { LogType } from 'consola';
import { LogLevels } from 'consola';
import dotenv from 'dotenv';
import { z } from 'zod';

import { ApplicationConfigurationException } from '../Exception';

const EnvSchema = z.object({
    allowedGroupId: z.string().default(''),
    logLevel: z
        .string()
        .refine((value): value is LogType => value in LogLevels, {
            message: 'logLevel must be a valid consola log type',
        })
        .default('info' as LogType),
    llmApiKey: z.string().default('not-needed'),
    llmBaseUrl: z.string().url().default('http://192.168.7.115:8001/v1'),
    llmModel: z.string().default('qwen3.5-9b'),
    port: z.coerce.number().int().positive().default(8000),
    wahaBaseUrl: z.string().url().default('http://localhost:3000'),
    wahaApiKey: z.string().default(''),
    wahaSession: z.string().default('default'),
});

export type AppSettings = z.infer<typeof EnvSchema>;
export type AppLogLevel = LogType;

export class AppConfig implements AppSettings {
    public readonly allowedGroupId: string;
    public readonly logLevel: AppLogLevel;
    public readonly llmApiKey: string;
    public readonly llmBaseUrl: string;
    public readonly llmModel: string;
    public readonly port: number;
    public readonly wahaBaseUrl: string;
    public readonly wahaApiKey: string;
    public readonly wahaSession: string;

    public constructor() {
        dotenv.config();

        const rawEnv = {
            allowedGroupId: process.env.GROUP_ID,
            logLevel: process.env.LOG_LEVEL,
            llmApiKey: process.env.LLM_API_KEY,
            llmBaseUrl: process.env.LLM_BASE_URL,
            llmModel: process.env.LLM_MODEL,
            port: process.env.PORT,
            wahaBaseUrl: process.env.WAHA_BASE_URL,
            wahaApiKey: process.env.WAHA_API_KEY,
            wahaSession: process.env.WAHA_SESSION,
        };

        const parsed = EnvSchema.safeParse(rawEnv);

        if (!parsed.success) {
            const errorMessage = parsed.error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ');

            throw new ApplicationConfigurationException(`Invalid environment configuration: ${errorMessage}`);
        }

        this.allowedGroupId = parsed.data.allowedGroupId;
        this.logLevel = parsed.data.logLevel as AppLogLevel;
        this.llmApiKey = parsed.data.llmApiKey;
        this.llmBaseUrl = parsed.data.llmBaseUrl.replace(/\/+$/, '');
        this.llmModel = parsed.data.llmModel;
        this.port = parsed.data.port;
        this.wahaBaseUrl = parsed.data.wahaBaseUrl.replace(/\/+$/, '');
        this.wahaApiKey = parsed.data.wahaApiKey;
        this.wahaSession = parsed.data.wahaSession;
    }
}
