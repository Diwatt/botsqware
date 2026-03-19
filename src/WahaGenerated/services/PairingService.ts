/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Base64File } from '../models/Base64File';
import type { QRCodeValue } from '../models/QRCodeValue';
import type { RequestCodeRequest } from '../models/RequestCodeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PairingService {
    /**
     * Get QR code for pairing WhatsApp API.
     * @param session Session name
     * @param format
     * @returns any
     * @throws ApiError
     */
    public static authControllerGetQr(
        session: any,
        format: 'image' | 'raw' = 'image',
    ): CancelablePromise<(Base64File | QRCodeValue)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/auth/qr',
            path: {
                'session': session,
            },
            query: {
                'format': format,
            },
        });
    }
    /**
     * Request authentication code.
     * @param session Session name
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static authControllerRequestCode(
        session: any,
        requestBody: RequestCodeRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/auth/request-code',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get a screenshot of the current WhatsApp session (**WEBJS/WPP** only)
     * @param session
     * @returns any
     * @throws ApiError
     */
    public static screenshotControllerScreenshot(
        session: string = 'default',
    ): CancelablePromise<Base64File> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/screenshot',
            query: {
                'session': session,
            },
        });
    }
}
