/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type App = {
    /**
     * Enable or disable this app without deleting it. If omitted, treated as enabled (true).
     */
    enabled?: boolean;
    id: string;
    session: string;
    app: App.app;
    config: Record<string, any>;
};
export namespace App {
    export enum app {
        CHATWOOT = 'chatwoot',
        CALLS = 'calls',
    }
}

