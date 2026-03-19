/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WAHAPresenceData = {
    /**
     * Chat ID - participant or contact id
     */
    participant: string;
    lastSeen?: number;
    lastKnownPresence: WAHAPresenceData.lastKnownPresence;
};
export namespace WAHAPresenceData {
    export enum lastKnownPresence {
        OFFLINE = 'offline',
        ONLINE = 'online',
        TYPING = 'typing',
        RECORDING = 'recording',
        PAUSED = 'paused',
    }
}

