/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SessionStatusPoint = {
    status: SessionStatusPoint.status;
    timestamp: number;
};
export namespace SessionStatusPoint {
    export enum status {
        STOPPED = 'STOPPED',
        STARTING = 'STARTING',
        SCAN_QR_CODE = 'SCAN_QR_CODE',
        WORKING = 'WORKING',
        FAILED = 'FAILED',
    }
}

