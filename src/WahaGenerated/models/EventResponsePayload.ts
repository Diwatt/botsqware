/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventResponse } from './EventResponse';
import type { MessageDestination } from './MessageDestination';
export type EventResponsePayload = {
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
    source: EventResponsePayload.source;
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
     * Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend.
     */
    _data?: Record<string, any>;
    eventCreationKey: MessageDestination;
    eventResponse?: EventResponse;
};
export namespace EventResponsePayload {
    /**
     * The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages.
     */
    export enum source {
        API = 'api',
        APP = 'app',
    }
}

