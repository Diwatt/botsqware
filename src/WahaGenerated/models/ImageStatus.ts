/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BinaryFile } from './BinaryFile';
import type { RemoteFile } from './RemoteFile';
export type ImageStatus = {
    /**
     * Pre-generated status message id
     */
    id?: string;
    /**
     * Contact list to send the status to.
     */
    contacts?: Array<string>;
    file: (RemoteFile | BinaryFile);
    caption?: string;
};

