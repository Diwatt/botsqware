import { setTimeout as sleep } from 'node:timers/promises';

import { AppConfig } from '../Core/AppConfig';
import { AppLogger } from '../Core/AppLogger';
import { Container } from '../Core/Container';

export class WahaHumanization {
  public constructor(
    private readonly baseUrl: string,
    private readonly session: string,
    private readonly apiKey: string,
    private readonly appLogger: AppLogger,
  ) {}

  public async sendSeen(chatId: string): Promise<void> {
    await this.post('sendSeen', { chatId });
  }

  public async sendText(chatId: string, text: string): Promise<void> {
    await this.post('sendText', { chatId, text });
  }

  public async simulateTypingAndSend(chatId: string, text: string): Promise<void> {
    await this.startTyping(chatId);

    const baseDelay = text.length / 15;
    const jitter = Math.random() + 0.5;
    const typingDurationSeconds = Math.min(Math.max(1, baseDelay + jitter), 10);

    this.appLogger.info('Simulating typing before sending message', {
      chatId,
      durationSeconds: Number(typingDurationSeconds.toFixed(1))
    });

    await sleep(Math.round(typingDurationSeconds * 1000));

    await this.stopTyping(chatId);
    await this.sendText(chatId, text);
  }

  public async startTyping(chatId: string): Promise<void> {
    await this.post('startTyping', { chatId });
  }

  public async stopTyping(chatId: string): Promise<void> {
    await this.post('stopTyping', { chatId });
  }

  private async post(endpoint: string, payload: Record<string, unknown>): Promise<void> {
    const url = `${this.baseUrl}/api/${endpoint}`;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['X-Api-Key'] = this.apiKey;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...payload,
          session: this.session,
        }),
      });

      if (!response.ok) {
        // NOWEB engine doesn't provide message store unless enabled, so sendSeen
        // can fail with 400. This is non-fatal and does not prevent sending replies.
        if (endpoint === 'sendSeen' && response.status === 400) {
          this.appLogger.debug('WAHA sendSeen returned 400 (NOWEB store not enabled)', {
            endpoint,
            status: response.status,
          });
          return;
        }

        this.appLogger.warn('WAHA request returned non-success status', {
          endpoint,
          status: response.status,
        });
      }
    } catch (error) {
      this.appLogger.warn('WAHA request failed', { endpoint, error });
    }
  }
}

Container.register(WahaHumanization, () => {
  const config = Container.get(AppConfig);
  const logger = Container.get(AppLogger);
  const settings = config.getSettings();
  return new WahaHumanization(settings.wahaBaseUrl, settings.wahaSession, settings.wahaApiKey, logger);
});