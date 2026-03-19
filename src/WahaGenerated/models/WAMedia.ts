/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { S3MediaData } from './S3MediaData';
export type WAMedia = {
    /**
     * The URL for the media in the message if any
     */
    url?: string;
    /**
     * mimetype for the media in the message if any
     */
    mimetype?: string;
    /**
     * The original filename in mediaUrl in the message if any
     */
    filename?: string;
    /**
     * S3 attributes for the media in the message if you are using S3 media storage
     */
    s3?: S3MediaData;
    /**
     * Error message if there's an error downloading the media
     */
    error?: Record<string, any>;
};

