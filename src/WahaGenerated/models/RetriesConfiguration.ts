/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RetriesConfiguration = {
    delaySeconds?: number;
    attempts?: number;
    policy?: RetriesConfiguration.policy;
};
export namespace RetriesConfiguration {
    export enum policy {
        LINEAR = 'linear',
        EXPONENTIAL = 'exponential',
        CONSTANT = 'constant',
    }
}

