/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GroupParticipant = {
    /**
     * Member ID in @c.us or @lid format
     */
    id: string;
    /**
     * Member ID in @c.us format
     */
    pn?: string;
    role: GroupParticipant.role;
};
export namespace GroupParticipant {
    export enum role {
        LEFT = 'left',
        PARTICIPANT = 'participant',
        ADMIN = 'admin',
        SUPERADMIN = 'superadmin',
    }
}

