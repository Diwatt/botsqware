/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatWootCommandsConfig } from './ChatWootCommandsConfig';
import type { ChatWootConversationsConfig } from './ChatWootConversationsConfig';
export type ChatWootAppConfig = {
    url: string;
    accountId: number;
    accountToken: string;
    inboxId: number;
    inboxIdentifier: string;
    linkPreview?: ChatWootAppConfig.linkPreview;
    locale: string;
    templates?: Record<string, any>;
    commands?: ChatWootCommandsConfig;
    conversations?: ChatWootConversationsConfig;
};
export namespace ChatWootAppConfig {
    export enum linkPreview {
        OFF = 'OFF',
        LG = 'LG',
        HG = 'HG',
    }
}

