/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MessagePollVoteRequest = {
    chatId: string;
    /**
     * The ID of the poll message. Format: {fromMe}_{chatID}_{messageId}[_{participant}] or just ID for GOWS
     */
    pollMessageId: string;
    /**
     * Only for Channels - server message id (if known); if omitted, API may look it up in the storage
     */
    pollServerId?: number;
    votes: Array<Array<string>>;
    session: string;
};

