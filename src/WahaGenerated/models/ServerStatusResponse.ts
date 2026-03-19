/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkerInfo } from './WorkerInfo';
export type ServerStatusResponse = {
    /**
     * The timestamp when the server started (milliseconds).
     */
    startTimestamp: number;
    /**
     * The uptime of the server in milliseconds.
     */
    uptime: number;
    worker: WorkerInfo;
};

