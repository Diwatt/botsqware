/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReplyToMessage } from './ReplyToMessage';
import type { WALocation } from './WALocation';
import type { WAMedia } from './WAMedia';
export type WAMessage = {
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
    source: WAMessage.source;
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
     * Message content
     */
    body: string;
    /**
     * Indicates if the message has media available for download
     */
    hasMedia: boolean;
    /**
     * Media object for the message if any and downloaded
     */
    media?: WAMedia;
    /**
     * Use `media.url` instead! The URL for the media in the message if any
     * @deprecated
     */
    mediaUrl: string;
    /**
     * ACK status for the message
     */
    ack: WAMessage.ack;
    /**
     * ACK status name for the message
     */
    ackName: string;
    /**
     * If the message was sent to a group, this field will contain the user that sent the message.
     */
    author?: string;
    /**
     * Location information contained in the message, if the message is type "location"
     */
    location?: WALocation;
    /**
     * List of vCards contained in the message.
     */
    vCards?: Array<string>;
    /**
     * Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend.
     */
    _data?: Record<string, any>;
    replyTo?: ReplyToMessage;
};
export namespace WAMessage {
    /**
     * The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages.
     */
    export enum source {
        API = 'api',
        APP = 'app',
    }
    /**
     * ACK status for the message
     */
    export enum ack {
        '_-1' = -1,
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
    }
}

