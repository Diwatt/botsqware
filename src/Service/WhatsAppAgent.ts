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
            baseURL: config.getSettings().llmBaseUrl,
            apiKey: config.getSettings().llmApiKey,
        });

        const agentCfg = {
            id: 'whatsapp-assistant',
            name: 'WhatsApp Assistant',
            instructions: `
                You are a professional and concise WhatsApp assistant. 
                Your goal is to provide helpful, direct, and brief answers. 
                Always maintain a friendly but efficient tone. 
                If the user speaks in another language, respond in that same language.
            `,
            model: localProvider(config.getSettings().llmModel),
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
            this.logger.error('Agent generation failed', error);
            return null;
        }
    }
}

// L'injection de dépendances reste inchangée et parfaite
Container.register(WhatsAppAgent, () => new WhatsAppAgent(Container.get(AppConfig), Container.get(AppLogger)));
