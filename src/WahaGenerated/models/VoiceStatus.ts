/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VoiceBinaryFile } from './VoiceBinaryFile';
import type { VoiceRemoteFile } from './VoiceRemoteFile';
export type VoiceStatus = {
    /**
     * Pre-generated status message id
     */
    id?: string;
    /**
     * Contact list to send the status to.
     */
    contacts?: Array<string>;
    file: (VoiceRemoteFile | VoiceBinaryFile);
    /**
     * Convert the input file to the required format using ffmpeg before sending
     */
    convert: boolean;
    backgroundColor: string;
};

