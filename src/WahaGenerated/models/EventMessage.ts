/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventLocation } from './EventLocation';
export type EventMessage = {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Description of the event
     */
    description?: string;
    /**
     * Start time of the event (Unix timestamp in seconds)
     */
    startTime: number;
    /**
     * End time of the event (Unix timestamp in seconds)
     */
    endTime?: number;
    /**
     * Location of the event
     */
    location?: EventLocation;
    /**
     * Whether extra guests are allowed
     */
    extraGuestsAllowed?: boolean;
};

