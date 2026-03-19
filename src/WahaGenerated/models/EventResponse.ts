/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventResponse = {
    response: EventResponse.response;
    timestampMs: number;
    extraGuestCount: number;
};
export namespace EventResponse {
    export enum response {
        UNKNOWN = 'UNKNOWN',
        GOING = 'GOING',
        NOT_GOING = 'NOT_GOING',
        MAYBE = 'MAYBE',
    }
}

