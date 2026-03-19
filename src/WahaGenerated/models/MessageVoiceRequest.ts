/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VoiceBinaryFile } from './VoiceBinaryFile';
import type { VoiceRemoteFile } from './VoiceRemoteFile';
export type MessageVoiceRequest = {
    chatId: string;
    file: (VoiceRemoteFile | VoiceBinaryFile);
    /**
     * The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA
     */
    reply_to?: string;
    /**
     * Convert the input file to the required format using ffmpeg before sending
     */
    convert: boolean;
    session: string;
};

