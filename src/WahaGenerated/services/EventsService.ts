/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventMessageRequest } from '../models/EventMessageRequest';
import type { WAMessage } from '../models/WAMessage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventsService {
    /**
     * Send an event message
     * @param session Session name
     * @param requestBody
     * @returns WAMessage
     * @throws ApiError
     */
    public static eventsControllerSendEvent(
        session: any,
        requestBody: EventMessageRequest,
    ): CancelablePromise<WAMessage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/events',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
