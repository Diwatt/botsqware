/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WAReaction } from './WAReaction';
export type WAMessageReaction = {
    /**
     * Message ID
     */
    id: string;
    /**
     * Unix timestamp for when the message was created
     */
    timestamp: number;
    /**
     * ID for the Chat that this message was sent to, except if the message was sent by the current user
     */
    from: string;
    /**
     * Indicates if the message was sent by the current user
     */
    fromMe: boolean;
    /**
     * The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages.
     */
    source: WAMessageReaction.source;
    /**
     *
     * * ID for who this message is for.
     * * If the message is sent by the current user, it will be the Chat to which the message is being sent.
     * * If the message is sent by another user, it will be the ID for the current user.
     *
     */
    to: string;
    /**
     * For groups - participant who sent the message
     */
    participant: string;
    /**
     * Reaction to the message. Either the reaction (emoji) or empty string to remove the reaction
     */
    reaction: WAReaction;
};
export namespace WAMessageReaction {
    /**
     * The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages.
     */
    export enum source {
        API = 'api',
        APP = 'app',
    }
}

