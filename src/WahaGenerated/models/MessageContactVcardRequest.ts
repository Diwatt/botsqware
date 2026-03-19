/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from './Contact';
import type { VCardContact } from './VCardContact';
export type MessageContactVcardRequest = {
    chatId: string;
    contacts: Array<(VCardContact | Contact)>;
    /**
     * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
     */
    reply_to?: string;
    session: string;
};

