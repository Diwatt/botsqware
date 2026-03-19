/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Channel } from '../models/Channel';
import type { ChannelCategory } from '../models/ChannelCategory';
import type { ChannelCountry } from '../models/ChannelCountry';
import type { ChannelListResult } from '../models/ChannelListResult';
import type { ChannelMessage } from '../models/ChannelMessage';
import type { ChannelSearchByText } from '../models/ChannelSearchByText';
import type { ChannelSearchByView } from '../models/ChannelSearchByView';
import type { ChannelView } from '../models/ChannelView';
import type { CreateChannelRequest } from '../models/CreateChannelRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChannelsService {
    /**
     * Get list of know channels
     * @param session Session name
     * @param role
     * @returns Channel
     * @throws ApiError
     */
    public static channelsControllerList(
        session: any,
        role?: 'OWNER' | 'ADMIN' | 'SUBSCRIBER',
    ): CancelablePromise<Array<Channel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/channels',
            path: {
                'session': session,
            },
            query: {
                'role': role,
            },
        });
    }
    /**
     * Create a new channel.
     * @param session Session name
     * @param requestBody
     * @returns Channel
     * @throws ApiError
     */
    public static channelsControllerCreate(
        session: any,
        requestBody: CreateChannelRequest,
    ): CancelablePromise<Channel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/channels',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete the channel.
     * @param session Session name
     * @param id WhatsApp Channel ID
     * @returns any
     * @throws ApiError
     */
    public static channelsControllerDelete(
        session: any,
        id: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/{session}/channels/{id}',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Get the channel info
     * You can use either id (123@newsletter) OR invite code (https://www.whatsapp.com/channel/123)
     * @param session Session name
     * @param id WhatsApp Channel ID or invite code from invite link https://www.whatsapp.com/channel/11111
     * @returns Channel
     * @throws ApiError
     */
    public static channelsControllerGet(
        session: any,
        id: any,
    ): CancelablePromise<Channel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/channels/{id}',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Preview channel messages
     * You can use either invite code (https://www.whatsapp.com/channel/123) or (123)ORChannel ID (123@newsletter).
     * @param session Session name
     * @param id Channel id or invite code
     * @param downloadMedia
     * @param limit
     * @returns ChannelMessage
     * @throws ApiError
     */
    public static channelsControllerPreviewChannelMessages(
        session: any,
        id: any,
        downloadMedia: boolean = false,
        limit: number = 10,
    ): CancelablePromise<Array<ChannelMessage>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/channels/{id}/messages/preview',
            path: {
                'session': session,
                'id': id,
            },
            query: {
                'downloadMedia': downloadMedia,
                'limit': limit,
            },
        });
    }
    /**
     * Follow the channel.
     * @param session Session name
     * @param id WhatsApp Channel ID
     * @returns any
     * @throws ApiError
     */
    public static channelsControllerFollow(
        session: any,
        id: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/channels/{id}/follow',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Unfollow the channel.
     * @param session Session name
     * @param id WhatsApp Channel ID
     * @returns any
     * @throws ApiError
     */
    public static channelsControllerUnfollow(
        session: any,
        id: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/channels/{id}/unfollow',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Mute the channel.
     * @param session Session name
     * @param id WhatsApp Channel ID
     * @returns any
     * @throws ApiError
     */
    public static channelsControllerMute(
        session: any,
        id: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/channels/{id}/mute',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Unmute the channel.
     * @param session Session name
     * @param id WhatsApp Channel ID
     * @returns any
     * @throws ApiError
     */
    public static channelsControllerUnmute(
        session: any,
        id: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/channels/{id}/unmute',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Search for channels (by view)
     * @param session Session name
     * @param requestBody
     * @returns ChannelListResult
     * @throws ApiError
     */
    public static channelsControllerSearchByView(
        session: any,
        requestBody: ChannelSearchByView,
    ): CancelablePromise<ChannelListResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/channels/search/by-view',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Search for channels (by text)
     * @param session Session name
     * @param requestBody
     * @returns ChannelListResult
     * @throws ApiError
     */
    public static channelsControllerSearchByText(
        session: any,
        requestBody: ChannelSearchByText,
    ): CancelablePromise<ChannelListResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/channels/search/by-text',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get list of views for channel search
     * @param session Session name
     * @returns ChannelView
     * @throws ApiError
     */
    public static channelsControllerGetSearchViews(
        session: any,
    ): CancelablePromise<Array<ChannelView>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/channels/search/views',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Get list of countries for channel search
     * @param session Session name
     * @returns ChannelCountry
     * @throws ApiError
     */
    public static channelsControllerGetSearchCountries(
        session: any,
    ): CancelablePromise<Array<ChannelCountry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/channels/search/countries',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Get list of categories for channel search
     * @param session Session name
     * @returns ChannelCategory
     * @throws ApiError
     */
    public static channelsControllerGetSearchCategories(
        session: any,
    ): CancelablePromise<Array<ChannelCategory>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/channels/search/categories',
            path: {
                'session': session,
            },
        });
    }
}
