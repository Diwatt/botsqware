/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WAMessageAckBody = {
    /**
     * Message ID
     */
    id: string;
    from: string;
    to: string;
    participant: string;
    fromMe: boolean;
    ack: WAMessageAckBody.ack;
    ackName: string;
    _data?: Record<string, any>;
};
export namespace WAMessageAckBody {
    export enum ack {
        '_-1' = -1,
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
    }
}

