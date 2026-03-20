import { createOpenAI } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';

import { AppConfig } from '../Core/AppConfig';
import { AppLogger } from '../Core/AppLogger';
import { Container } from '../Core/Container';

export class WhatsAppAgent {
    public readonly agent: Agent;

    public constructor(
        config: AppConfig,
        private readonly logger: AppLogger,
    ) {
        const localProvider = createOpenAI({
            baseURL: config.llmBaseUrl,
            apiKey: config.llmApiKey,
        });

        const agentCfg = {
            id: 'whatsapp-assistant',
            name: 'WhatsApp Assistant',
            instructions: `You are a highly efficient API-like WhatsApp router.
            Your ONLY function is to output the final user-facing response.
            Tone: Friendly, concise, professional.
            Language: Match the user's language exactly.
            FORMAT REQUIREMENT: Output strictly the final message. No introductory text. No inner monologue.`,
            model: localProvider(config.llmModel),
        };

        this.agent = new Agent(agentCfg);
    }

    public async processMessage(message: string): Promise<string | null> {
        const prompt = message.trim();
        if (!prompt) {
            return null;
        }

        try {
            const response = await this.agent.generate(prompt);
            return response.text ? response.text.trim() : null;
        } catch (error) {
            this.logger.sys.error('Agent generation failed', error);
            return null;
        }
    }
}

// L'injection de dépendances reste inchangée et parfaite
Container.register(WhatsAppAgent, () => new WhatsAppAgent(Container.get(AppConfig), Container.get(AppLogger)));
