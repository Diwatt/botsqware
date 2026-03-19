/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupId } from './GroupId';
import type { GroupParticipant } from './GroupParticipant';
export type GroupV2ParticipantsEvent = {
    /**
     * Type of the event
     */
    type: GroupV2ParticipantsEvent.type;
    /**
     * Unix timestamp
     */
    timestamp: number;
    group: GroupId;
    participants: Array<GroupParticipant>;
    _data: Record<string, any>;
};
export namespace GroupV2ParticipantsEvent {
    /**
     * Type of the event
     */
    export enum type {
        JOIN = 'join',
        LEAVE = 'leave',
        PROMOTE = 'promote',
        DEMOTE = 'demote',
    }
}

