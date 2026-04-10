import { Agent } from '@mastra/core/agent';
import type { Memory } from '@mastra/memory';

import { AppLogger } from '../Core/AppLogger';
import { Container } from '../Core/Container';
import { AgentMemory } from './AgentMemory';
import { LLMProvider } from './LLMProvider';
import { ThinkTagStripper } from './ThinkTagStripper';

export class WhatsAppAssistant {
    public readonly agent: Agent;

    public constructor(
        private readonly logger: AppLogger,
        private readonly memory: Memory,
        private readonly provider: LLMProvider,
    ) {
        const agentCfg = {
            id: 'whatsapp-assistant',
            name: 'WhatsApp Assistant',
            instructions: `You are a highly efficient API-like WhatsApp router.
Your ONLY function is to output the final user-facing response.
Tone: Friendly, concise, professional.
Language: You MUST respond in English only, regardless of the user's language.
FORMAT REQUIREMENT: Output strictly the final message. No introductory text. No inner monologue.`,
            model: this.provider.chat(),
            memory: this.memory,
            outputProcessors: [new ThinkTagStripper()],
        };

        this.agent = new Agent(agentCfg);
    }

    public async processMessage(message: string, resourceId?: string): Promise<string | null> {
        const prompt = message.trim();
        if (!prompt) {
            return null;
        }

        try {
            const response = resourceId
                ? await this.agent.generate(prompt, {
                      memory: { resource: resourceId, thread: `whatsapp-${resourceId}` },
                  })
                : await this.agent.generate(prompt);
            return response.text ? response.text.trim() : null;
        } catch (error) {
            this.logger.sys.error('Agent generation failed', { error });
            return null;
        }
    }
}

Container.register(WhatsAppAssistant, () => {
    return new WhatsAppAssistant(
        Container.get(AppLogger),
        Container.get(AgentMemory).getMemory(),
        Container.get(LLMProvider),
    );
});
