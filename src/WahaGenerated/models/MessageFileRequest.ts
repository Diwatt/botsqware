/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BinaryFile } from './BinaryFile';
import type { RemoteFile } from './RemoteFile';
export type MessageFileRequest = {
    chatId: string;
    file: (RemoteFile | BinaryFile);
    /**
     * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
     */
    reply_to?: string;
    caption?: string;
    session: string;
};

