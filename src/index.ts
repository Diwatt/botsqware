import { serve } from 'bun';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { WahaConfigurator } from './Api/WahaConfigurator';
import { AppConfig } from './Core/AppConfig';
import { AppLogger } from './Core/AppLogger';
import { Container } from './Core/Container';
import { WhatsAppWebhook } from './Router/WhatsAppWebhook';

Container.initialize();

const App = new Hono();

App.use('*', logger());
App.get('/health', (c) => c.json({ status: 'ok', service: 'botsware-ts' }));

WhatsAppWebhook(App);


await Container.get<WahaConfigurator>(WahaConfigurator).ensureSession();

Container.get(AppLogger).sys.info('Botsware listening', { port: Container.get(AppConfig).port });

serve({
    hostname: '0.0.0.0',
    port: Container.get(AppConfig).port,
    fetch: App.fetch.bind(App),
});
