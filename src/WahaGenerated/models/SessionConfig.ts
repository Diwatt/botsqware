/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientSessionConfig } from './ClientSessionConfig';
import type { GowsConfig } from './GowsConfig';
import type { IgnoreConfig } from './IgnoreConfig';
import type { NowebConfig } from './NowebConfig';
import type { ProxyConfig } from './ProxyConfig';
import type { WebhookConfig } from './WebhookConfig';
import type { WebjsConfig } from './WebjsConfig';
export type SessionConfig = {
    /**
     * Metadata for the session. You'll get 'metadata' in all webhooks.
     */
    metadata?: Record<string, any>;
    proxy?: ProxyConfig;
    debug?: boolean;
    /**
     * Ignore some events related to specific chats
     */
    ignore?: IgnoreConfig;
    /**
     * How connected session renders in device - in format 'Browser (Device)' - Firefox (MacOS)
     */
    client?: ClientSessionConfig;
    noweb?: NowebConfig;
    gows?: GowsConfig;
    /**
     * WebJS-specific settings.
     */
    webjs?: WebjsConfig;
    webhooks?: Array<WebhookConfig>;
};

