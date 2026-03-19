/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { App } from './App';
import type { MeInfo } from './MeInfo';
import type { SessionConfig } from './SessionConfig';
export type SessionInfo = {
    /**
     * Session name (id)
     */
    name: string;
    /**
     * Apps configured for the session.
     */
    apps?: Array<App> | null;
    me?: MeInfo;
    assignedWorker?: string;
    presence: Record<string, any>;
    timestamps: {
        activity?: number | null;
    };
    status: SessionInfo.status;
    config?: SessionConfig;
};
export namespace SessionInfo {
    export enum status {
        STOPPED = 'STOPPED',
        STARTING = 'STARTING',
        SCAN_QR_CODE = 'SCAN_QR_CODE',
        WORKING = 'WORKING',
        FAILED = 'FAILED',
    }
}

