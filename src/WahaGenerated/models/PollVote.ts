/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PollVote = {
    /**
     * Message ID
     */
    id: string;
    /**
     * Option that user has selected
     */
    selectedOptions: Array<string>;
    /**
     * Timestamp, ms
     */
    timestamp: number;
    to: string;
    from: string;
    fromMe: boolean;
    participant?: string;
};

