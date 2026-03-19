/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MyProfile } from '../models/MyProfile';
import type { ProfileNameRequest } from '../models/ProfileNameRequest';
import type { ProfilePictureRequest } from '../models/ProfilePictureRequest';
import type { ProfileStatusRequest } from '../models/ProfileStatusRequest';
import type { Result } from '../models/Result';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileService {
    /**
     * Get my profile
     * @param session Session name
     * @returns MyProfile
     * @throws ApiError
     */
    public static profileControllerGetMyProfile(
        session: any,
    ): CancelablePromise<MyProfile> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/profile',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Set my profile name
     * @param session Session name
     * @param requestBody
     * @returns Result
     * @throws ApiError
     */
    public static profileControllerSetProfileName(
        session: any,
        requestBody: ProfileNameRequest,
    ): CancelablePromise<Result> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/profile/name',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Set profile status (About)
     * @param session Session name
     * @param requestBody
     * @returns Result
     * @throws ApiError
     */
    public static profileControllerSetProfileStatus(
        session: any,
        requestBody: ProfileStatusRequest,
    ): CancelablePromise<Result> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/profile/status',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Set profile picture
     * @param session Session name
     * @param requestBody
     * @returns Result
     * @throws ApiError
     */
    public static profileControllerSetProfilePicture(
        session: any,
        requestBody: ProfilePictureRequest,
    ): CancelablePromise<Result> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/profile/picture',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete profile picture
     * @param session Session name
     * @returns Result
     * @throws ApiError
     */
    public static profileControllerDeleteProfilePicture(
        session: any,
    ): CancelablePromise<Result> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/{session}/profile/picture',
            path: {
                'session': session,
            },
        });
    }
}
