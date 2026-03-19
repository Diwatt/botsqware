/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SendSeenRequest = {
    chatId: string;
    /**
     * @deprecated
     */
    messageId?: string;
    messageIds?: Array<string>;
    /**
     * NOWEB engine only - the ID of the user that sent the message (undefined for individual chats)
     */
    participant?: string;
    session: string;
};

