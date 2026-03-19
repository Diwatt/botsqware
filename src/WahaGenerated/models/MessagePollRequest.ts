/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessagePoll } from './MessagePoll';
export type MessagePollRequest = {
    chatId: string;
    /**
     * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
     */
    reply_to?: string;
    poll: MessagePoll;
    session: string;
};

