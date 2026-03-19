/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { App } from './App';
import type { SessionConfig } from './SessionConfig';
export type SessionCreateRequest = {
    /**
     * Session name (id)
     */
    name?: string;
    /**
     * Apps to be synchronized for this session.
     */
    apps?: Array<App> | null;
    /**
     * Start session after creation
     */
    start?: boolean;
    config?: SessionConfig;
};

