import type { Hono } from 'hono';
import { z } from 'zod';

import { AppConfig } from '../Core/AppConfig';
import { AppLogger } from '../Core/AppLogger';
import { Container } from '../Core/Container';
import { TypeHumanizer, WhatsAppAssistant } from '../Service';
import { swallow } from '../Util';

const WhatsAppWebhookSchema = z
    .object({
        event: z.string(),
        session: z.string(),
        me: z
            .object({
                id: z.string(),
                pushName: z.string().optional(),
                lid: z.string().optional(),
            })
            .optional(),
        payload: z
            .object({
                id: z.string(),
                timestamp: z.number(),
                from: z.string(),
                to: z.string().optional(),
                fromMe: z.boolean().optional(),
                body: z.string().optional(),
                participant: z.string().optional(),
                source: z.string().optional(),
                hasMedia: z.boolean().optional(),
                media: z.any().optional(),
                ack: z.number().optional(),
                ackName: z.string().optional(),
                location: z.any().optional(),
                vCards: z.any().optional(),
                replyTo: z.any().optional(),
                _data: z.any().optional(),
            })
            .passthrough(),
        engine: z.string().optional(),
        environment: z.any().optional(),
    })
    .passthrough();

const BOT_TRIGGER = '@bot';
export function WhatsAppWebhook(app: Hono): void {
    const appLogger = Container.get(AppLogger);
    const whatsAppAssistant = Container.get(WhatsAppAssistant);
    const typeHumanizer = Container.get(TypeHumanizer);
    const allowedGroupId = Container.get(AppConfig).allowedGroupId;

    app.post('/webhooks/whatsapp', async (c) => {
        const parsedBody = await c.req.json();

        appLogger.sys.debug('Incoming webhook', parsedBody);

        const parseResult = WhatsAppWebhookSchema.safeParse(parsedBody);
        if (!parseResult.success) {
            return c.json({ status: 'ok' });
        }

        const body = parseResult.data;
        if (body.event !== 'message.any') {
            return c.json({ status: 'ok' });
        }

        const text = body.payload.body?.trim() || '';
        if (!text.toLowerCase().includes(BOT_TRIGGER)) {
            return c.json({ status: 'ok' });
        }

        const messageId = body.payload.id;
        const chatId = body.payload.from;
        if (allowedGroupId && chatId !== allowedGroupId) {
            return c.json({ status: 'ok' });
        }

        const promptText = text.slice(text.toLowerCase().indexOf(BOT_TRIGGER) + BOT_TRIGGER.length).trim();
        if (!promptText) {
            return c.json({ status: 'ok' });
        }

        appLogger.sys.info('Bot triggered', { chatId });

        await typeHumanizer.markAsSeen(chatId);
        await swallow(typeHumanizer.sendThinkingReaction(chatId, messageId));
        typeHumanizer
            .executeWithHumanTyping(chatId, async () => {
                const replyText = await whatsAppAssistant.processMessage(promptText, chatId);

                return replyText || "Désolé, j'ai eu un petit trou de mémoire. 😅";
            })
            .catch((error) => {
                appLogger.sys.error('Background execution failed', { error });
            });

        return c.json({ status: 'ok' });
    });
}
