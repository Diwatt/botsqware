/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Channel = {
    /**
     * Newsletter id
     */
    id: string;
    /**
     * Channel name
     */
    name: string;
    /**
     * Invite link
     */
    invite: string;
    /**
     * Preview for channel's picture
     */
    preview?: string;
    /**
     * Channel's picture
     */
    picture?: string;
    role: Channel.role;
    description?: string;
    verified: boolean;
    subscribersCount: number;
};
export namespace Channel {
    export enum role {
        OWNER = 'OWNER',
        ADMIN = 'ADMIN',
        SUBSCRIBER = 'SUBSCRIBER',
        GUEST = 'GUEST',
    }
}

