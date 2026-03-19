/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WAHAChatPresences } from '../models/WAHAChatPresences';
import type { WAHASessionPresence } from '../models/WAHASessionPresence';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PresenceService {
    /**
     * Set session presence
     * @param session Session name
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static presenceControllerSetPresence(
        session: any,
        requestBody: WAHASessionPresence,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/presence',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all subscribed presence information.
     * @param session Session name
     * @returns WAHAChatPresences
     * @throws ApiError
     */
    public static presenceControllerGetPresenceAll(
        session: any,
    ): CancelablePromise<Array<WAHAChatPresences>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/presence',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Get the presence for the chat id. If it hasn't been subscribed - it also subscribes to it.
     * @param session Session name
     * @param chatId Chat ID
     * @returns WAHAChatPresences
     * @throws ApiError
     */
    public static presenceControllerGetPresence(
        session: any,
        chatId: string,
    ): CancelablePromise<WAHAChatPresences> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/presence/{chatId}',
            path: {
                'session': session,
                'chatId': chatId,
            },
        });
    }
    /**
     * Subscribe to presence events for the chat.
     * @param session Session name
     * @param chatId Chat ID
     * @returns any
     * @throws ApiError
     */
    public static presenceControllerSubscribe(
        session: any,
        chatId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/presence/{chatId}/subscribe',
            path: {
                'session': session,
                'chatId': chatId,
            },
        });
    }
}
