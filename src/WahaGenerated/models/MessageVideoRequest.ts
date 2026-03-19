/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VideoBinaryFile } from './VideoBinaryFile';
import type { VideoRemoteFile } from './VideoRemoteFile';
export type MessageVideoRequest = {
    chatId: string;
    file: (VideoRemoteFile | VideoBinaryFile);
    /**
     * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
     */
    reply_to?: string;
    /**
     * Send as video note (aka instant or round video).
     */
    asNote?: boolean;
    /**
     * Convert the input file to the required format using ffmpeg before sending
     */
    convert: boolean;
    caption?: string;
    session: string;
};

