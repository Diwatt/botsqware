/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RejectCallRequest } from '../models/RejectCallRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CallsService {
    /**
     * Reject incoming call
     * @param session Session name
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static callsControllerRejectCall(
        session: any,
        requestBody: RejectCallRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/calls/reject',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
