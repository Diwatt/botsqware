/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PingResponse } from '../models/PingResponse';
import type { ServerStatusResponse } from '../models/ServerStatusResponse';
import type { StopRequest } from '../models/StopRequest';
import type { StopResponse } from '../models/StopResponse';
import type { WAHAEnvironment } from '../models/WAHAEnvironment';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ObservabilityService {
    /**
     * Ping the server
     * Check if the server is alive and responding to requests.
     * @returns PingResponse
     * @throws ApiError
     */
    public static pingControllerPing(): CancelablePromise<PingResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ping',
        });
    }
    /**
     * Check the health of the server
     * Perform all health checks and return the server's health status.
     * @returns any The Health Check is successful
     * @throws ApiError
     */
    public static healthControllerCheck(): CancelablePromise<{
        status?: string;
        info?: Record<string, Record<string, any>> | null;
        error?: Record<string, Record<string, any>> | null;
        details?: Record<string, Record<string, any>>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
            errors: {
                503: `The Health Check is not successful`,
            },
        });
    }
    /**
     * Get the version of the server
     * @returns WAHAEnvironment
     * @throws ApiError
     */
    public static serverControllerGet(): CancelablePromise<WAHAEnvironment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/server/version',
        });
    }
    /**
     * Get the server environment
     * @param all Include all environment variables
     * @returns any
     * @throws ApiError
     */
    public static serverControllerEnvironment(
        all: boolean = false,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/server/environment',
            query: {
                'all': all,
            },
        });
    }
    /**
     * Get the server status
     * @returns ServerStatusResponse
     * @throws ApiError
     */
    public static serverControllerStatus(): CancelablePromise<ServerStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/server/status',
        });
    }
    /**
     * Stop (and restart) the server
     * If you're using docker, after calling this endpoint Docker will start a new container, so you can use this endpoint to restart the server
     * @param requestBody
     * @returns StopResponse
     * @throws ApiError
     */
    public static serverControllerStop(
        requestBody: StopRequest,
    ): CancelablePromise<StopResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/server/stop',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Collect and return a CPU profile for the current nodejs process
     * Uses the Node.js inspector profiler to capture a .cpuprofile
     * @param seconds How many seconds to sample CPU
     * @returns any
     * @throws ApiError
     */
    public static serverDebugControllerCpuProfile(
        seconds: number = 30,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/server/debug/cpu',
            query: {
                'seconds': seconds,
            },
        });
    }
    /**
     * Return a heapsnapshot for the current nodejs process
     * Return a heapsnapshot of the server's memory
     * @returns any
     * @throws ApiError
     */
    public static serverDebugControllerHeapsnapshot(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/server/debug/heapsnapshot',
        });
    }
    /**
     * Collect and get a trace.json for Chrome DevTools
     * Uses https://pptr.dev/api/puppeteer.tracing
     * @param session Session name
     * @param categories Categories to trace (all by default)
     * @param seconds How many seconds to trace
     * @returns any
     * @throws ApiError
     */
    public static serverDebugControllerBrowserTrace(
        session: any,
        categories: Array<string>,
        seconds: number = 30,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/server/debug/browser/trace/{session}',
            path: {
                'session': session,
            },
            query: {
                'seconds': seconds,
                'categories': categories,
            },
        });
    }
    /**
     * @deprecated
     * Get the server version
     * Use 'GET /api/server/version' instead
     * @returns WAHAEnvironment
     * @throws ApiError
     */
    public static versionControllerGet(): CancelablePromise<WAHAEnvironment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/version',
        });
    }
}
