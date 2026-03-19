import dotenv from 'dotenv';
import { z } from 'zod';

import { ApplicationConfigurationException } from '../Exception';

const EnvSchema = z.object({
    allowedGroupId: z.string().default(''),
    logLevel: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
    llmApiKey: z.string().default('not-needed'),
    llmBaseUrl: z.string().url().default('http://192.168.7.115:8001/v1'),
    llmModel: z.string().default('qwen3.5-9b'),
    port: z.coerce.number().int().positive().default(8000),
    wahaBaseUrl: z.string().url().default('http://localhost:3000'),
    wahaApiKey: z.string().default(''),
    wahaSession: z.string().default('default'),
});

export type AppSettings = z.infer<typeof EnvSchema>;

export class AppConfig {
    public readonly settings: AppSettings;

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

            throw new ApplicationConfigurationException(`Invalid environment configuration: ${errorMessage}`);
        }

        this.settings = parsed.data;
    }

    public getSettings(): AppSettings {
        return this.settings;
    }
}
