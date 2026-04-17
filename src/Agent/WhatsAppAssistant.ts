import { Agent } from '@mastra/core/agent';
import type { Memory } from '@mastra/memory';

import { AppLogger } from '../Core/AppLogger';
import { Container } from '../Core/Container';
import { AddOpportunityTool } from '../Tool/AddOpportunityTool';
import { AgentMemory } from './AgentMemory';
import { LLMProvider } from './LLMProvider';
import { ThinkTagStripper } from './ThinkTagStripper';

export class WhatsAppAssistant {
    public readonly agent: Agent;

    public constructor(
        private readonly logger: AppLogger,
        private readonly memory: Memory,
        private readonly provider: LLMProvider,
        private readonly addOpportunityTool: AddOpportunityTool,
    ) {
        const agentCfg = {
            id: 'whatsapp-assistant',
            name: 'WhatsApp Assistant',
            instructions: `You are the virtual booking assistant for a music band.
Your role is to capture gig, festival, contest, and residency opportunities from incoming messages and save them to the CRM using the add-opportunity tool.

When a user shares an opportunity:
- Extract all available details (name, type, city, venue, URL, event date, deadline, notes).
- Call the add-opportunity tool with whatever information is provided.
- If details are missing, save what you have and casually ask the user for the rest.

Tone: Friendly, concise, professional.
Language: You MUST respond in English only, regardless of the user's language.
FORMAT: Output strictly the final user-facing message. No introductory text. No inner monologue.`,
            model: this.provider.chat(),
            memory: this.memory,
            outputProcessors: [new ThinkTagStripper()],
            tools: {
                addOpportunity: this.addOpportunityTool.tool,
            },
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
        Container.get(AddOpportunityTool),
    );
});