/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiKeyDTO } from '../models/ApiKeyDTO';
import type { ApiKeyRequest } from '../models/ApiKeyRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApiKeysService {
    /**
     * Create a new API key
     * @param requestBody
     * @returns ApiKeyDTO
     * @throws ApiError
     */
    public static apiKeysControllerCreate(
        requestBody: ApiKeyRequest,
    ): CancelablePromise<ApiKeyDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/keys',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all API keys
     * @returns ApiKeyDTO
     * @throws ApiError
     */
    public static apiKeysControllerList(): CancelablePromise<Array<ApiKeyDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/keys',
        });
    }
    /**
     * Update an API key
     * @param id
     * @param requestBody
     * @returns ApiKeyDTO
     * @throws ApiError
     */
    public static apiKeysControllerUpdate(
        id: string,
        requestBody: ApiKeyRequest,
    ): CancelablePromise<ApiKeyDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/keys/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an API key
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static apiKeysControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/keys/{id}',
            path: {
                'id': id,
            },
        });
    }
}
