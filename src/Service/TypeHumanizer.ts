import { setTimeout as sleep } from 'node:timers/promises';
import { WahaProvider } from '../Api/WahaProvider';
import { AppLogger } from '../Core/AppLogger';
import { Container } from '../Core/Container';

export enum Emoji {
    Hourglass = '\u{23F3}',
    Eyes = '\u{1F440}',
    Thinking = '\u{1F914}',
    Robot = '\u{1F916}',
    Bolt = '\u{26A1}',
    Monocle = '\u{1F9D0}',
    Writing = '\u{270D}',
    Success = '\u{2705}',
    Error = '\u{274C}',
}

export class TypeHumanizer {
    private readonly thinkingEmotes: Emoji[] = [
        Emoji.Hourglass,
        Emoji.Eyes,
        Emoji.Thinking,
        Emoji.Robot,
        Emoji.Bolt,
        Emoji.Monocle,
        Emoji.Writing,
    ];

    public constructor(
        private readonly wahaProvider: WahaProvider,
        private readonly appLogger: AppLogger,
    ) {}

    public async markAsSeen(chatId: string): Promise<void> {
        await this.wahaProvider.sendSeen(chatId);
    }

    public async sendText(chatId: string, text: string): Promise<void> {
        await this.wahaProvider.sendText({ chatId, text });
    }

    public async sendThinkingReaction(chatId: string, messageId: string): Promise<void> {
        const randomEmote = this.thinkingEmotes[Math.floor(Math.random() * this.thinkingEmotes.length)];
        await this.sendReaction(chatId, messageId, randomEmote);
    }

    public async sendErrorReaction(chatId: string, messageId: string): Promise<void> {
        await this.sendReaction(chatId, messageId, Emoji.Error);
    }

    public async sendSuccessReaction(chatId: string, messageId: string): Promise<void> {
        await this.sendReaction(chatId, messageId, Emoji.Success);
    }

    public async sendReaction(chatId: string, messageId: string, reaction: Emoji | string): Promise<void> {
        const readingTime = Math.random() * 4000 + 4000;

        this.appLogger.sys.debug('Simulating reaction delay', {
            chatId,
            reaction,
            delayMs: Math.round(readingTime),
        });

        await sleep(Math.round(readingTime));

        await this.wahaProvider.setReaction({ chatId, messageId, reaction });
    }

    public async executeWithHumanTyping(chatId: string, llmTask: () => Promise<string>): Promise<void> {
        this.appLogger.sys.info('Starting realistic typing simulation', { chatId });

        await this.wahaProvider.startTyping(chatId);
        const startLlmTime = Date.now();

        const text = await llmTask();
        const llmDurationMs = Date.now() - startLlmTime;

        this.appLogger.sys.info('LLM response generated', {
            chatId,
            llmDurationMs,
            textLength: text.length,
        });

        const baseTypingTimeMs = text.length * 100;
        const maxTypingTimeMs = Math.floor(Math.random() * 18000) + 12000;
        const expectedHumanTimeMs = Math.min(baseTypingTimeMs, maxTypingTimeMs);

        const remainingTypingTimeMs = Math.max(0, expectedHumanTimeMs - llmDurationMs);
        const minTypingTimeMs = 2000;

        const totalTypingTimeMs = remainingTypingTimeMs + minTypingTimeMs;

        this.appLogger.sys.debug('Simulating typing delay', {
            chatId,
            remainingTypingTimeMs,
            minTypingTimeMs,
            totalTypingTimeMs,
        });
        await this.simulateHesitations(chatId, totalTypingTimeMs);

        await this.wahaProvider.stopTyping(chatId);
        await this.sendText(chatId, text);
    }

    private async simulateHesitations(chatId: string, totalDurationMs: number): Promise<void> {
        const averageCycleMs = 2500;
        const cycles = Math.ceil(totalDurationMs / averageCycleMs);
        const timePerCycleMs = totalDurationMs / cycles;

        for (let cycle = 0; cycle < cycles; cycle++) {
            const pauseMs = timePerCycleMs * 0.3;
            const typingMs = timePerCycleMs * 0.7;

            await this.wahaProvider.stopTyping(chatId);
            await sleep(pauseMs);

            await this.wahaProvider.startTyping(chatId);
            await sleep(typingMs);
        }
    }
}

Container.register(TypeHumanizer, () => {
    return new TypeHumanizer(Container.get(WahaProvider), Container.get(AppLogger));
});
