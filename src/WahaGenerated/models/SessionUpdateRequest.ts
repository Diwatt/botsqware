/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { App } from './App';
import type { SessionConfig } from './SessionConfig';
export type SessionUpdateRequest = {
    /**
     * Apps to be synchronized for this session.
     */
    apps?: Array<App> | null;
    config?: SessionConfig;
};

