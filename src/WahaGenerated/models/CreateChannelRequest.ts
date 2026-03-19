/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BinaryFile } from './BinaryFile';
import type { RemoteFile } from './RemoteFile';
export type CreateChannelRequest = {
    name: string;
    description?: string;
    picture?: (RemoteFile | BinaryFile);
};

