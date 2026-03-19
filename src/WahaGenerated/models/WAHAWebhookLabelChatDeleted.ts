/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LabelChatAssociation } from './LabelChatAssociation';
import type { MeInfo } from './MeInfo';
import type { WAHAEnvironment } from './WAHAEnvironment';
export type WAHAWebhookLabelChatDeleted = {
    /**
     * Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec
     */
    id: string;
    /**
     * Unix timestamp (ms) for when the event was created.
     */
    timestamp: number;
    session: string;
    /**
     * Metadata for the session.
     */
    metadata?: Record<string, any>;
    engine: WAHAWebhookLabelChatDeleted.engine;
    /**
     * The event is triggered when a label is deleted from a chat
     */
    event: WAHAWebhookLabelChatDeleted.event;
    payload: LabelChatAssociation;
    me?: MeInfo;
    environment: WAHAEnvironment;
};
export namespace WAHAWebhookLabelChatDeleted {
    export enum engine {
        WEBJS = 'WEBJS',
        WPP = 'WPP',
        NOWEB = 'NOWEB',
        GOWS = 'GOWS',
    }
    /**
     * The event is triggered when a label is deleted from a chat
     */
    export enum event {
        SESSION_STATUS = 'session.status',
        MESSAGE = 'message',
        MESSAGE_REACTION = 'message.reaction',
        MESSAGE_ANY = 'message.any',
        MESSAGE_ACK = 'message.ack',
        MESSAGE_ACK_GROUP = 'message.ack.group',
        MESSAGE_WAITING = 'message.waiting',
        MESSAGE_REVOKED = 'message.revoked',
        MESSAGE_EDITED = 'message.edited',
        STATE_CHANGE = 'state.change',
        GROUP_JOIN = 'group.join',
        GROUP_LEAVE = 'group.leave',
        GROUP_V2_JOIN = 'group.v2.join',
        GROUP_V2_LEAVE = 'group.v2.leave',
        GROUP_V2_UPDATE = 'group.v2.update',
        GROUP_V2_PARTICIPANTS = 'group.v2.participants',
        PRESENCE_UPDATE = 'presence.update',
        POLL_VOTE = 'poll.vote',
        POLL_VOTE_FAILED = 'poll.vote.failed',
        CHAT_ARCHIVE = 'chat.archive',
        CALL_RECEIVED = 'call.received',
        CALL_ACCEPTED = 'call.accepted',
        CALL_REJECTED = 'call.rejected',
        LABEL_UPSERT = 'label.upsert',
        LABEL_DELETED = 'label.deleted',
        LABEL_CHAT_ADDED = 'label.chat.added',
        LABEL_CHAT_DELETED = 'label.chat.deleted',
        EVENT_RESPONSE = 'event.response',
        EVENT_RESPONSE_FAILED = 'event.response.failed',
        ENGINE_EVENT = 'engine.event',
    }
}

