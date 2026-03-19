/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WAMessage } from './WAMessage';
export type WAMessageRevokedBody = {
    /**
     * ID of the message that was revoked
     */
    revokedMessageId?: string;
    after?: WAMessage;
    before?: WAMessage;
    _data?: Record<string, any>;
};

