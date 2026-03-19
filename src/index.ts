import { serve } from 'bun';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { registerWhatsAppWebhookRoutes } from './Api/WhatsAppWebhook';
import { AppConfig } from './Core/AppConfig';
import { AppLogger } from './Core/AppLogger';
import { Container } from './Core/Container';

Container.initialize();

const App = new Hono();

App.use('*', logger());
App.get('/health', (c) => c.json({ status: 'ok', service: 'botsware-ts' }));

registerWhatsAppWebhookRoutes(App);

async function ensureWahaSessionStore(): Promise<void> {
  const config = Container.get(AppConfig).getSettings();
  const logger = Container.get(AppLogger);

  if (!config.wahaBaseUrl) {
    logger.warn('WAHA base URL is not configured; skipping WAHA session initialization.');
    return;
  }

  const baseUrl = config.wahaBaseUrl.replace(/\/+$/, '');
  const session = config.wahaSession;
  const apiKey = config.wahaApiKey;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['X-Api-Key'] = apiKey;
  }

  const sessionUrl = `${baseUrl}/api/sessions/${encodeURIComponent(session)}`;

  try {
    const sessionResp = await fetch(sessionUrl, { method: 'GET', headers });

    if (sessionResp.ok) {
      const body = await sessionResp.json().catch(() => undefined);
      const storeEnabled = body?.config?.noweb?.store?.enabled;
      const fullSync = body?.config?.noweb?.store?.fullSync;

      if (storeEnabled === true && fullSync === true) {
        logger.info('WAHA session already has NOWEB store enabled.', { session });
        return;
      }

      logger.warn(
        'WAHA session exists but NOWEB store is not enabled (sendSeen may fail).',
        { session, storeEnabled, fullSync },
      );
      return;
    }

    if (sessionResp.status === 404) {
      logger.info('WAHA session not found; creating session with NOWEB store enabled.', { session });

      const createResp = await fetch(`${baseUrl}/api/sessions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: session,
          config: {
            noweb: {
              store: {
                enabled: true,
                fullSync: true,
              },
            },
          },
        }),
      });

      if (!createResp.ok) {
        const text = await createResp.text().catch(() => '');
        logger.warn('Failed to create WAHA session.', { status: createResp.status, body: text });
      }

      return;
    }

    const text = await sessionResp.text().catch(() => '');
    logger.warn('Unexpected response when checking WAHA session.', { status: sessionResp.status, body: text });
  } catch (error) {
    logger.warn('Unable to initialize WAHA session store.', { error });
  }
}

await ensureWahaSessionStore();

Container.get(AppLogger).info('Botsware listening', { port: Container.get(AppConfig).getSettings().port });

serve({
  hostname: '0.0.0.0',
  port: Container.get(AppConfig).getSettings().port,
  fetch: App.fetch.bind(App),
});
