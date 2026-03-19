/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VideoBinaryFile } from './VideoBinaryFile';
import type { VideoRemoteFile } from './VideoRemoteFile';
export type VideoStatus = {
    /**
     * Pre-generated status message id
     */
    id?: string;
    /**
     * Contact list to send the status to.
     */
    contacts?: Array<string>;
    file: (VideoRemoteFile | VideoBinaryFile);
    /**
     * Convert the input file to the required format using ffmpeg before sending
     */
    convert: boolean;
    caption?: string;
};

