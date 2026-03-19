/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatPictureResponse } from '../models/ChatPictureResponse';
import type { CountResponse } from '../models/CountResponse';
import type { CreateGroupRequest } from '../models/CreateGroupRequest';
import type { DescriptionRequest } from '../models/DescriptionRequest';
import type { GroupParticipant } from '../models/GroupParticipant';
import type { JoinGroupRequest } from '../models/JoinGroupRequest';
import type { JoinGroupResponse } from '../models/JoinGroupResponse';
import type { ParticipantsRequest } from '../models/ParticipantsRequest';
import type { ProfilePictureRequest } from '../models/ProfilePictureRequest';
import type { Result } from '../models/Result';
import type { SettingsSecurityChangeInfo } from '../models/SettingsSecurityChangeInfo';
import type { SubjectRequest } from '../models/SubjectRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GroupsService {
    /**
     * Create a new group.
     * @param session Session name
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerCreateGroup(
        session: any,
        requestBody: CreateGroupRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/groups',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all groups.
     * @param session Session name
     * @param sortBy Sort by field
     * @param sortOrder Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)
     * @param limit
     * @param offset
     * @param exclude Exclude fields
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerGetGroups(
        session: any,
        sortBy?: 'id' | 'subject',
        sortOrder?: 'desc' | 'asc',
        limit?: number,
        offset?: number,
        exclude?: Array<'' | 'participants'>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/groups',
            path: {
                'session': session,
            },
            query: {
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'limit': limit,
                'offset': offset,
                'exclude': exclude,
            },
        });
    }
    /**
     * Get info about the group before joining.
     * @param session Session name
     * @param code Group code (123) or url (https://chat.whatsapp.com/123)
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerJoinInfoGroup(
        session: any,
        code: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/groups/join-info',
            path: {
                'session': session,
            },
            query: {
                'code': code,
            },
        });
    }
    /**
     * Join group via code
     * @param session Session name
     * @param requestBody
     * @returns JoinGroupResponse
     * @throws ApiError
     */
    public static groupsControllerJoinGroup(
        session: any,
        requestBody: JoinGroupRequest,
    ): CancelablePromise<JoinGroupResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/groups/join',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get the number of groups.
     * @param session Session name
     * @returns CountResponse
     * @throws ApiError
     */
    public static groupsControllerGetGroupsCount(
        session: any,
    ): CancelablePromise<CountResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/groups/count',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Refresh groups from the server.
     * @param session Session name
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerRefreshGroups(
        session: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/groups/refresh',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Get the group.
     * @param session Session name
     * @param id Group ID
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerGetGroup(
        session: any,
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/groups/{id}',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Delete the group.
     * @param session Session name
     * @param id Group ID
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerDeleteGroup(
        session: any,
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/{session}/groups/{id}',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Leave the group.
     * @param session Session name
     * @param id Group ID
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerLeaveGroup(
        session: any,
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/groups/{id}/leave',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Get group picture
     * @param session Session name
     * @param id Group ID
     * @param refresh Refresh the picture from the server (24h cache by default). Do not refresh if not needed, you can get rate limit error
     * @returns ChatPictureResponse
     * @throws ApiError
     */
    public static groupsControllerGetChatPicture(
        session: any,
        id: string,
        refresh: boolean = false,
    ): CancelablePromise<ChatPictureResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/groups/{id}/picture',
            path: {
                'session': session,
                'id': id,
            },
            query: {
                'refresh': refresh,
            },
        });
    }
    /**
     * Set group picture
     * @param id Group ID
     * @param session Session name
     * @param requestBody
     * @returns Result
     * @throws ApiError
     */
    public static groupsControllerSetPicture(
        id: string,
        session: any,
        requestBody: ProfilePictureRequest,
    ): CancelablePromise<Result> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/groups/{id}/picture',
            path: {
                'id': id,
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete group picture
     * @param id Group ID
     * @param session Session name
     * @returns Result
     * @throws ApiError
     */
    public static groupsControllerDeletePicture(
        id: string,
        session: any,
    ): CancelablePromise<Result> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/{session}/groups/{id}/picture',
            path: {
                'id': id,
                'session': session,
            },
        });
    }
    /**
     * Updates the group description.
     * Returns "true" if the subject was properly updated. This can return "false" if the user does not have the necessary permissions.
     * @param session Session name
     * @param id Group ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerSetDescription(
        session: any,
        id: string,
        requestBody: DescriptionRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/groups/{id}/description',
            path: {
                'session': session,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Updates the group subject
     * Returns "true" if the subject was properly updated. This can return "false" if the user does not have the necessary permissions.
     * @param session Session name
     * @param id Group ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerSetSubject(
        session: any,
        id: string,
        requestBody: SubjectRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/groups/{id}/subject',
            path: {
                'session': session,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Updates the group "info admin only" settings.
     * You can allow only admins to edit group info (title, description, photo).
     * @param session Session name
     * @param id Group ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerSetInfoAdminOnly(
        session: any,
        id: string,
        requestBody: SettingsSecurityChangeInfo,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/groups/{id}/settings/security/info-admin-only',
            path: {
                'session': session,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get the group's 'info admin only' settings.
     * You can allow only admins to edit group info (title, description, photo).
     * @param session Session name
     * @param id Group ID
     * @returns SettingsSecurityChangeInfo
     * @throws ApiError
     */
    public static groupsControllerGetInfoAdminOnly(
        session: any,
        id: string,
    ): CancelablePromise<SettingsSecurityChangeInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/groups/{id}/settings/security/info-admin-only',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Update settings - who can send messages
     * Updates the group settings to only allow admins to send messages.
     * @param session Session name
     * @param id Group ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerSetMessagesAdminOnly(
        session: any,
        id: string,
        requestBody: SettingsSecurityChangeInfo,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/groups/{id}/settings/security/messages-admin-only',
            path: {
                'session': session,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get settings - who can send messages
     * The group settings to only allow admins to send messages.
     * @param session Session name
     * @param id Group ID
     * @returns SettingsSecurityChangeInfo
     * @throws ApiError
     */
    public static groupsControllerGetMessagesAdminOnly(
        session: any,
        id: string,
    ): CancelablePromise<SettingsSecurityChangeInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/groups/{id}/settings/security/messages-admin-only',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Gets the invite code for the group.
     * @param session Session name
     * @param id Group ID
     * @returns string
     * @throws ApiError
     */
    public static groupsControllerGetInviteCode(
        session: any,
        id: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/groups/{id}/invite-code',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Invalidates the current group invite code and generates a new one.
     * @param session Session name
     * @param id Group ID
     * @returns string
     * @throws ApiError
     */
    public static groupsControllerRevokeInviteCode(
        session: any,
        id: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/groups/{id}/invite-code/revoke',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Get participants
     * @param session Session name
     * @param id Group ID
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerGetParticipants(
        session: any,
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/groups/{id}/participants',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Get group participants.
     * @param session Session name
     * @param id Group ID
     * @returns GroupParticipant
     * @throws ApiError
     */
    public static groupsControllerGetGroupParticipants(
        session: any,
        id: string,
    ): CancelablePromise<Array<GroupParticipant>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/groups/{id}/participants/v2',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Add participants
     * @param session Session name
     * @param id Group ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerAddParticipants(
        session: any,
        id: string,
        requestBody: ParticipantsRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/groups/{id}/participants/add',
            path: {
                'session': session,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Remove participants
     * @param session Session name
     * @param id Group ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerRemoveParticipants(
        session: any,
        id: string,
        requestBody: ParticipantsRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/groups/{id}/participants/remove',
            path: {
                'session': session,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Promote participants to admin users.
     * @param session Session name
     * @param id Group ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerPromoteToAdmin(
        session: any,
        id: string,
        requestBody: ParticipantsRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/groups/{id}/admin/promote',
            path: {
                'session': session,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Demotes participants to regular users.
     * @param session Session name
     * @param id Group ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static groupsControllerDemoteToAdmin(
        session: any,
        id: string,
        requestBody: ParticipantsRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/groups/{id}/admin/demote',
            path: {
                'session': session,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
