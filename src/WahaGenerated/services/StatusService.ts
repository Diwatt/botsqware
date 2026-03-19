/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeleteStatusRequest } from '../models/DeleteStatusRequest';
import type { ImageStatus } from '../models/ImageStatus';
import type { NewMessageIDResponse } from '../models/NewMessageIDResponse';
import type { TextStatus } from '../models/TextStatus';
import type { VideoStatus } from '../models/VideoStatus';
import type { VoiceStatus } from '../models/VoiceStatus';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatusService {
    /**
     * Send text status
     * @param session Session name
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static statusControllerSendTextStatus(
        session: any,
        requestBody: TextStatus,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/status/text',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send image status
     * @param session Session name
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static statusControllerSendImageStatus(
        session: any,
        requestBody: ImageStatus,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/status/image',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send voice status
     * @param session Session name
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static statusControllerSendVoiceStatus(
        session: any,
        requestBody: VoiceStatus,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/status/voice',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send video status
     * @param session Session name
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static statusControllerSendVideoStatus(
        session: any,
        requestBody: VideoStatus,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/status/video',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * DELETE sent status
     * @param session Session name
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static statusControllerDeleteStatus(
        session: any,
        requestBody: DeleteStatusRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/status/delete',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Generate message ID you can use to batch contacts
     * @param session Session name
     * @returns NewMessageIDResponse
     * @throws ApiError
     */
    public static statusControllerGetNewMessageId(
        session: any,
    ): CancelablePromise<NewMessageIDResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/status/new-message-id',
            path: {
                'session': session,
            },
        });
    }
}
