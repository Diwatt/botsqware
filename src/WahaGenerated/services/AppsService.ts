/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { App } from '../models/App';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AppsService {
    /**
     * List all apps for a session
     * @param session Session name to list apps for
     * @returns any
     * @throws ApiError
     */
    public static appsControllerList(
        session: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/apps',
            query: {
                'session': session,
            },
        });
    }
    /**
     * Create a new app
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static appsControllerCreate(
        requestBody: App,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/apps',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get app by ID
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static appsControllerGet(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/apps/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an existing app
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static appsControllerUpdate(
        id: string,
        requestBody: App,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/apps/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an app
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static appsControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/apps/{id}',
            path: {
                'id': id,
            },
        });
    }
}
