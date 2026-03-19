/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageDestination } from './MessageDestination';
import type { PollVote } from './PollVote';
export type PollVotePayload = {
    vote: PollVote;
    poll: MessageDestination;
    _data?: Record<string, any>;
};

