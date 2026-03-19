/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionStatusPoint } from './SessionStatusPoint';
export type WASessionStatusBody = {
    name: string;
    status: WASessionStatusBody.status;
    statuses: Array<SessionStatusPoint>;
};
export namespace WASessionStatusBody {
    export enum status {
        STOPPED = 'STOPPED',
        STARTING = 'STARTING',
        SCAN_QR_CODE = 'SCAN_QR_CODE',
        WORKING = 'WORKING',
        FAILED = 'FAILED',
    }
}

