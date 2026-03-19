/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkPreviewData } from './LinkPreviewData';
export type MessageLinkCustomPreviewRequest = {
    chatId: string;
    /**
     * The text to send. MUST include the URL provided in preview.url
     */
    text: string;
    /**
     * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
     */
    reply_to?: string;
    linkPreviewHighQuality?: boolean;
    preview: LinkPreviewData;
    session: string;
};

