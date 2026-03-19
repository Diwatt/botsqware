/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BinaryFile } from './BinaryFile';
import type { Button } from './Button';
import type { RemoteFile } from './RemoteFile';
export type SendButtonsRequest = {
    chatId: string;
    header: string;
    headerImage?: (RemoteFile | BinaryFile);
    body: string;
    footer: string;
    buttons: Array<Button>;
    session: string;
};

