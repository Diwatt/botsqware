/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChatWootConversationsConfig = {
    /**
     * Process message.ack events to mark ChatWoot conversations as read. Enabled by default.
     */
    markAsRead?: boolean;
    sort: ChatWootConversationsConfig.sort;
    status: Array<'open' | 'pending' | 'snoozed' | 'resolved'> | null;
};
export namespace ChatWootConversationsConfig {
    export enum sort {
        ACTIVITY_NEWEST = 'activity_newest',
        CREATED_NEWEST = 'created_newest',
        CREATED_OLDEST = 'created_oldest',
        ACTIVITY_OLDEST = 'activity_oldest',
    }
}

