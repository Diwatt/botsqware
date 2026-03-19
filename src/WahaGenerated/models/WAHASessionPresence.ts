/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WAHASessionPresence = {
    /**
     * Chat ID - either group id or contact id. Required for chat-related presence statuses; omit for ONLINE/OFFLINE.
     */
    chatId?: string;
    presence: WAHASessionPresence.presence;
};
export namespace WAHASessionPresence {
    export enum presence {
        OFFLINE = 'offline',
        ONLINE = 'online',
        TYPING = 'typing',
        RECORDING = 'recording',
        PAUSED = 'paused',
    }
}

