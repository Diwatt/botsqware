/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NowebStoreConfig = {
    /**
     * Enable or disable the store for contacts, chats, and messages.
     */
    enabled: boolean;
    /**
     * Enable full sync on session initialization (when scanning QR code).
     * Full sync will download all contacts, chats, and messages from the phone.
     * If disabled, only messages early than 90 days will be downloaded and some contacts may be missing.
     */
    fullSync: boolean;
};

