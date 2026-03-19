/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionConfig } from './SessionConfig';
export type SessionDTO = {
    /**
     * Session name (id)
     */
    name: string;
    status: SessionDTO.status;
    config?: SessionConfig;
};
export namespace SessionDTO {
    export enum status {
        STOPPED = 'STOPPED',
        STARTING = 'STARTING',
        SCAN_QR_CODE = 'SCAN_QR_CODE',
        WORKING = 'WORKING',
        FAILED = 'FAILED',
    }
}

