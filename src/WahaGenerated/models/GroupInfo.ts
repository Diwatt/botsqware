/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupParticipant } from './GroupParticipant';
export type GroupInfo = {
    id: string;
    subject: string;
    description: string;
    /**
     * Invite URL
     */
    invite?: string;
    /**
     * Members can add new members
     */
    membersCanAddNewMember: boolean;
    /**
     * Members can send messages to the group
     */
    membersCanSendMessages: boolean;
    /**
     * Admin approval required for new members
     */
    newMembersApprovalRequired: boolean;
    participants: Array<GroupParticipant>;
};

