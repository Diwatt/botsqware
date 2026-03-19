/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CallsAppChannelConfig } from './CallsAppChannelConfig';
export type CallsAppConfig = {
    /**
     * Rules applied to direct messages (non-group calls)
     */
    dm: CallsAppChannelConfig;
    /**
     * Rules applied to group calls
     */
    group: CallsAppChannelConfig;
};

