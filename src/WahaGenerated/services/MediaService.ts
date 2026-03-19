/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Base64File } from '../models/Base64File';
import type { VideoFileDTO } from '../models/VideoFileDTO';
import type { VoiceFileDTO } from '../models/VoiceFileDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MediaService {
    /**
     * Convert voice to WhatsApp format (opus)
     * @param session Session name
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static mediaControllerConvertVoice(
        session: any,
        requestBody: VoiceFileDTO,
    ): CancelablePromise<Base64File> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/media/convert/voice',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Convert video to WhatsApp format (mp4)
     * @param session Session name
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static mediaControllerConvertVideo(
        session: any,
        requestBody: VideoFileDTO,
    ): CancelablePromise<Base64File> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/media/convert/video',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
