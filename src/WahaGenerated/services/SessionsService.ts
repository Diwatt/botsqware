/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeInfo } from '../models/MeInfo';
import type { SessionCreateRequest } from '../models/SessionCreateRequest';
import type { SessionDTO } from '../models/SessionDTO';
import type { SessionInfo } from '../models/SessionInfo';
import type { SessionLogoutDeprecatedRequest } from '../models/SessionLogoutDeprecatedRequest';
import type { SessionStartDeprecatedRequest } from '../models/SessionStartDeprecatedRequest';
import type { SessionStopDeprecatedRequest } from '../models/SessionStopDeprecatedRequest';
import type { SessionUpdateRequest } from '../models/SessionUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SessionsService {
    /**
     * List all sessions
     * @param expand Expand additional session details.
     * @param all Return all sessions, including those that are in the STOPPED state.
     * @returns SessionInfo
     * @throws ApiError
     */
    public static sessionsControllerList(
        expand?: Array<'apps'>,
        all?: boolean,
    ): CancelablePromise<Array<SessionInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sessions',
            query: {
                'expand': expand,
                'all': all,
            },
        });
    }
    /**
     * Create a session
     * Create session a new session (and start it at the same time if required).
     * @param requestBody
     * @returns SessionDTO
     * @throws ApiError
     */
    public static sessionsControllerCreate(
        requestBody: SessionCreateRequest,
    ): CancelablePromise<SessionDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sessions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get session information
     * @param session Session name
     * @param expand Expand additional session details.
     * @returns SessionInfo
     * @throws ApiError
     */
    public static sessionsControllerGet(
        session: any,
        expand?: Array<'apps'>,
    ): CancelablePromise<SessionInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sessions/{session}',
            path: {
                'session': session,
            },
            query: {
                'expand': expand,
            },
        });
    }
    /**
     * Update a session
     * @param session Session name
     * @param requestBody
     * @returns SessionDTO
     * @throws ApiError
     */
    public static sessionsControllerUpdate(
        session: any,
        requestBody: SessionUpdateRequest,
    ): CancelablePromise<SessionDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/sessions/{session}',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete the session
     * Delete the session with the given name. Stop and logout as well. Idempotent operation.
     * @param session Session name
     * @returns any
     * @throws ApiError
     */
    public static sessionsControllerDelete(
        session: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/sessions/{session}',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Get information about the authenticated account
     * @param session Session name
     * @returns MeInfo
     * @throws ApiError
     */
    public static sessionsControllerGetMe(
        session: any,
    ): CancelablePromise<MeInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sessions/{session}/me',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Start the session
     * Start the session with the given name. The session must exist. Idempotent operation.
     * @param session Session name
     * @returns SessionDTO
     * @throws ApiError
     */
    public static sessionsControllerStart(
        session: any,
    ): CancelablePromise<SessionDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sessions/{session}/start',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Stop the session
     * Stop the session with the given name. Idempotent operation.
     * @param session Session name
     * @returns SessionDTO
     * @throws ApiError
     */
    public static sessionsControllerStop(
        session: any,
    ): CancelablePromise<SessionDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sessions/{session}/stop',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Logout from the session
     * Logout the session, restart a session if it was not STOPPED
     * @param session Session name
     * @returns SessionDTO
     * @throws ApiError
     */
    public static sessionsControllerLogout(
        session: any,
    ): CancelablePromise<SessionDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sessions/{session}/logout',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Restart the session
     * Restart the session with the given name.
     * @param session Session name
     * @returns SessionDTO
     * @throws ApiError
     */
    public static sessionsControllerRestart(
        session: any,
    ): CancelablePromise<SessionDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sessions/{session}/restart',
            path: {
                'session': session,
            },
        });
    }
    /**
     * @deprecated
     * Upsert and Start session
     * Create session (if not exists) or update a config (if exists) and start it.
     * @param requestBody
     * @returns SessionDTO
     * @throws ApiError
     */
    public static sessionsControllerDepracatedStart(
        requestBody: SessionStartDeprecatedRequest,
    ): CancelablePromise<SessionDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sessions/start',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @deprecated
     * Stop (and Logout if asked) session
     * Stop session and Logout by default.
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static sessionsControllerDeprecatedStop(
        requestBody: SessionStopDeprecatedRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sessions/stop',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @deprecated
     * Logout and Delete session.
     * Stop, Logout and Delete session.
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static sessionsControllerDeprecatedLogout(
        requestBody: SessionLogoutDeprecatedRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sessions/logout',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
