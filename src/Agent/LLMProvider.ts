import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

import { AppConfig } from '../Core/AppConfig';
import { Container } from '../Core/Container';

export class LLMProvider {
    private readonly anthropicProvider: ReturnType<typeof createAnthropic>;
    private readonly openAiProvider: ReturnType<typeof createOpenAI>;

    public constructor(private readonly config: AppConfig) {
        this.anthropicProvider = createAnthropic({
            baseURL: config.llmChatUrl,
            apiKey: config.llmApiKey,
        });

        this.openAiProvider = createOpenAI({
            baseURL: config.llmEmbeddingUrl,
            apiKey: config.llmApiKey,
        });
    }

    public chat() {
        return this.anthropicProvider(this.config.llmModel);
    }

    public embedding(modelId: string) {
        return this.openAiProvider.embeddingModel(modelId);
    }
}

Container.register(LLMProvider, () => new LLMProvider(Container.get(AppConfig)));