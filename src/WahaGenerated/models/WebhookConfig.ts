/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomHeader } from './CustomHeader';
import type { HmacConfiguration } from './HmacConfiguration';
import type { RetriesConfiguration } from './RetriesConfiguration';
export type WebhookConfig = {
    /**
     * You can use https://docs.webhook.site/ to test webhooks and see the payload
     */
    url: string;
    events: Array<Record<string, any>>;
    hmac?: HmacConfiguration;
    retries?: RetriesConfiguration;
    customHeaders?: Array<CustomHeader>;
};

