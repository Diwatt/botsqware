/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Button = {
    text: string;
    id?: string;
    url?: string;
    phoneNumber?: string;
    copyCode?: string;
    type: Button.type;
};
export namespace Button {
    export enum type {
        REPLY = 'reply',
        URL = 'url',
        CALL = 'call',
        COPY = 'copy',
    }
}

