/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Label } from '../models/Label';
import type { LabelBody } from '../models/LabelBody';
import type { SetLabelsRequest } from '../models/SetLabelsRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LabelsService {
    /**
     * Get all labels
     * @param session Session name
     * @returns Label
     * @throws ApiError
     */
    public static labelsControllerGetAll(
        session: any,
    ): CancelablePromise<Array<Label>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/labels',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Create a new label
     * @param session Session name
     * @param requestBody
     * @returns Label
     * @throws ApiError
     */
    public static labelsControllerCreate(
        session: any,
        requestBody: LabelBody,
    ): CancelablePromise<Label> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/labels',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Update a label
     * @param session Session name
     * @param labelId
     * @param requestBody
     * @returns Label
     * @throws ApiError
     */
    public static labelsControllerUpdate(
        session: any,
        labelId: string,
        requestBody: LabelBody,
    ): CancelablePromise<Label> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/labels/{labelId}',
            path: {
                'session': session,
                'labelId': labelId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a label
     * @param session Session name
     * @param labelId
     * @returns any
     * @throws ApiError
     */
    public static labelsControllerDelete(
        session: any,
        labelId: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/{session}/labels/{labelId}',
            path: {
                'session': session,
                'labelId': labelId,
            },
        });
    }
    /**
     * Get labels for the chat
     * @param session Session name
     * @param chatId Chat ID
     * @returns Label
     * @throws ApiError
     */
    public static labelsControllerGetChatLabels(
        session: any,
        chatId: string,
    ): CancelablePromise<Array<Label>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/labels/chats/{chatId}',
            path: {
                'session': session,
                'chatId': chatId,
            },
        });
    }
    /**
     * Save labels for the chat
     * @param session Session name
     * @param chatId Chat ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static labelsControllerPutChatLabels(
        session: any,
        chatId: string,
        requestBody: SetLabelsRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/labels/chats/{chatId}',
            path: {
                'session': session,
                'chatId': chatId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get chats by label
     * @param session Session name
     * @param labelId
     * @returns any
     * @throws ApiError
     */
    public static labelsControllerGetChatsByLabel(
        session: any,
        labelId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/labels/{labelId}/chats',
            path: {
                'session': session,
                'labelId': labelId,
            },
        });
    }
}
