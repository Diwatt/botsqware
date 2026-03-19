import type { Hono } from 'hono';
import { z } from 'zod';

import { AppConfig } from '../Core/AppConfig';
import { AppLogger } from '../Core/AppLogger';
import { Container } from '../Core/Container';
import { WahaHumanization, WhatsAppAgent } from '../Service';

const WhatsAppWebhookSchema = z.object({
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
}).passthrough();

const BOT_TRIGGER = '@bot';
export function registerWhatsAppWebhookRoutes(app: Hono): void {
    const appLogger = Container.get(AppLogger);
    const whatsAppAgent = Container.get(WhatsAppAgent);
    const wahaHumanization = Container.get(WahaHumanization);
    const allowedGroupId = Container.get(AppConfig).getSettings().allowedGroupId;

    app.post('/webhooks/whatsapp', async (c) => {
        const parsedBody = await c.req.json();

        appLogger.debug('Incoming webhook', parsedBody);

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

        const chatId = body.payload.from;
        if (allowedGroupId && chatId !== allowedGroupId) {
            return c.json({ status: 'ok' });
        }

        const promptText = text.slice(text.toLowerCase().indexOf(BOT_TRIGGER) + BOT_TRIGGER.length).trim();
        if (!promptText) {
            return c.json({ status: 'ok' });
        }

        appLogger.info('Bot triggered', { chatId });

        await wahaHumanization.sendSeen(chatId);
        const replyText = await whatsAppAgent.processMessage(promptText);
        
        if (replyText) {
            await wahaHumanization.simulateTypingAndSend(chatId, replyText);
        }

        return c.json({ status: 'ok' });
    });
}
