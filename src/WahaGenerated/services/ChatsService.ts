/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatPictureResponse } from '../models/ChatPictureResponse';
import type { ChatSummary } from '../models/ChatSummary';
import type { EditMessageRequest } from '../models/EditMessageRequest';
import type { OverviewBodyRequest } from '../models/OverviewBodyRequest';
import type { PinMessageRequest } from '../models/PinMessageRequest';
import type { ReadChatMessagesResponse } from '../models/ReadChatMessagesResponse';
import type { WAMessage } from '../models/WAMessage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatsService {
    /**
     * Get chats
     * @param session Session name
     * @param sortBy Sort by field
     * @param sortOrder Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)
     * @param merge Merge LID (@lid) and phone-number (@c.us) chats referencing the same contact
     * @param limit
     * @param offset
     * @returns any
     * @throws ApiError
     */
    public static chatsControllerGetChats(
        session: any,
        sortBy?: 'conversationTimestamp' | 'id' | 'name',
        sortOrder?: 'desc' | 'asc',
        merge: boolean = true,
        limit?: number,
        offset?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/chats',
            path: {
                'session': session,
            },
            query: {
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'merge': merge,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Get chats overview. Includes all necessary things to build UI "your chats overview" page - chat id, name, picture, last message. Sorting by last message timestamp
     * @param session Session name
     * @param merge Merge LID (@lid) and phone-number (@c.us) chats referencing the same contact
     * @param limit
     * @param offset
     * @param ids Filter by chat ids
     * @returns ChatSummary
     * @throws ApiError
     */
    public static chatsControllerGetChatsOverview(
        session: any,
        merge: boolean = true,
        limit: number = 20,
        offset?: number,
        ids?: Array<string>,
    ): CancelablePromise<Array<ChatSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/chats/overview',
            path: {
                'session': session,
            },
            query: {
                'merge': merge,
                'limit': limit,
                'offset': offset,
                'ids': ids,
            },
        });
    }
    /**
     * Get chats overview. Use POST if you have too many "ids" params - GET can limit it
     * @param session Session name
     * @param requestBody
     * @returns ChatSummary
     * @throws ApiError
     */
    public static chatsControllerPostChatsOverview(
        session: any,
        requestBody: OverviewBodyRequest,
    ): CancelablePromise<Array<ChatSummary>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/chats/overview',
            path: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Deletes the chat
     * @param session Session name
     * @param chatId Chat ID
     * @returns any
     * @throws ApiError
     */
    public static chatsControllerDeleteChat(
        session: any,
        chatId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/{session}/chats/{chatId}',
            path: {
                'session': session,
                'chatId': chatId,
            },
        });
    }
    /**
     * Gets chat picture
     * @param session Session name
     * @param chatId
     * @param refresh Refresh the picture from the server (24h cache by default). Do not refresh if not needed, you can get rate limit error
     * @returns ChatPictureResponse
     * @throws ApiError
     */
    public static chatsControllerGetChatPicture(
        session: any,
        chatId: string,
        refresh: boolean = false,
    ): CancelablePromise<ChatPictureResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/chats/{chatId}/picture',
            path: {
                'session': session,
                'chatId': chatId,
            },
            query: {
                'refresh': refresh,
            },
        });
    }
    /**
     * Gets messages in the chat
     * @param session Session name
     * @param chatId Chat ID
     * @param sortBy Sort by field
     * @param sortOrder Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)
     * @param downloadMedia Download media for messages
     * @param merge Merge LID (@lid) and phone-number (@c.us) chats referencing the same contact
     * @param limit
     * @param offset
     * @param filterTimestampLte Filter messages before this timestamp (inclusive)
     * @param filterTimestampGte Filter messages after this timestamp (inclusive)
     * @param filterFromMe From me filter (by default shows all messages)
     * @param filterAck Filter messages by acknowledgment status
     * @returns WAMessage
     * @throws ApiError
     */
    public static chatsControllerGetChatMessages(
        session: any,
        chatId: string,
        sortBy: 'timestamp' | 'messageTimestamp' = 'timestamp',
        sortOrder?: 'desc' | 'asc',
        downloadMedia: boolean = true,
        merge: boolean = true,
        limit: number = 10,
        offset?: number,
        filterTimestampLte?: number,
        filterTimestampGte?: number,
        filterFromMe?: boolean,
        filterAck?: 'ERROR' | 'PENDING' | 'SERVER' | 'DEVICE' | 'READ' | 'PLAYED',
    ): CancelablePromise<Array<WAMessage>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/chats/{chatId}/messages',
            path: {
                'session': session,
                'chatId': chatId,
            },
            query: {
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'downloadMedia': downloadMedia,
                'merge': merge,
                'limit': limit,
                'offset': offset,
                'filter.timestamp.lte': filterTimestampLte,
                'filter.timestamp.gte': filterTimestampGte,
                'filter.fromMe': filterFromMe,
                'filter.ack': filterAck,
            },
        });
    }
    /**
     * Clears all messages from the chat
     * @param session Session name
     * @param chatId Chat ID
     * @returns any
     * @throws ApiError
     */
    public static chatsControllerClearMessages(
        session: any,
        chatId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/{session}/chats/{chatId}/messages',
            path: {
                'session': session,
                'chatId': chatId,
            },
        });
    }
    /**
     * Read unread messages in the chat
     * @param session Session name
     * @param chatId Chat ID
     * @param messages How much messages to read (latest first)
     * @param days How much days to read (latest first)
     * @returns ReadChatMessagesResponse
     * @throws ApiError
     */
    public static chatsControllerReadChatMessages(
        session: any,
        chatId: string,
        messages?: number,
        days: number = 7,
    ): CancelablePromise<ReadChatMessagesResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/chats/{chatId}/messages/read',
            path: {
                'session': session,
                'chatId': chatId,
            },
            query: {
                'messages': messages,
                'days': days,
            },
        });
    }
    /**
     * Gets message by id
     * @param session Session name
     * @param chatId Chat ID
     * @param messageId
     * @param downloadMedia Download media for messages
     * @param merge Merge LID (@lid) and phone-number (@c.us) chats referencing the same contact
     * @returns WAMessage
     * @throws ApiError
     */
    public static chatsControllerGetChatMessage(
        session: any,
        chatId: string,
        messageId: string,
        downloadMedia: boolean = true,
        merge: boolean = true,
    ): CancelablePromise<WAMessage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/chats/{chatId}/messages/{messageId}',
            path: {
                'session': session,
                'chatId': chatId,
                'messageId': messageId,
            },
            query: {
                'downloadMedia': downloadMedia,
                'merge': merge,
            },
        });
    }
    /**
     * Deletes a message from the chat
     * @param session Session name
     * @param chatId Chat ID
     * @param messageId Message ID in format <code>{fromMe}_{chat}_{message_id}[_{participant}]</code>
     * @returns any
     * @throws ApiError
     */
    public static chatsControllerDeleteMessage(
        session: any,
        chatId: string,
        messageId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/{session}/chats/{chatId}/messages/{messageId}',
            path: {
                'session': session,
                'chatId': chatId,
                'messageId': messageId,
            },
        });
    }
    /**
     * Edits a message in the chat
     * @param session Session name
     * @param chatId Chat ID
     * @param messageId Message ID in format <code>{fromMe}_{chat}_{message_id}[_{participant}]</code>
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chatsControllerEditMessage(
        session: any,
        chatId: string,
        messageId: string,
        requestBody: EditMessageRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/chats/{chatId}/messages/{messageId}',
            path: {
                'session': session,
                'chatId': chatId,
                'messageId': messageId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Pins a message in the chat
     * @param session Session name
     * @param chatId Chat ID
     * @param messageId
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chatsControllerPinMessage(
        session: any,
        chatId: string,
        messageId: string,
        requestBody: PinMessageRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/chats/{chatId}/messages/{messageId}/pin',
            path: {
                'session': session,
                'chatId': chatId,
                'messageId': messageId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Unpins a message in the chat
     * @param session Session name
     * @param chatId Chat ID
     * @param messageId
     * @returns any
     * @throws ApiError
     */
    public static chatsControllerUnpinMessage(
        session: any,
        chatId: string,
        messageId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/chats/{chatId}/messages/{messageId}/unpin',
            path: {
                'session': session,
                'chatId': chatId,
                'messageId': messageId,
            },
        });
    }
    /**
     * Archive the chat
     * @param session Session name
     * @param chatId Chat ID
     * @returns any
     * @throws ApiError
     */
    public static chatsControllerArchiveChat(
        session: any,
        chatId: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/chats/{chatId}/archive',
            path: {
                'session': session,
                'chatId': chatId,
            },
        });
    }
    /**
     * Unarchive the chat
     * @param session Session name
     * @param chatId Chat ID
     * @returns any
     * @throws ApiError
     */
    public static chatsControllerUnarchiveChat(
        session: any,
        chatId: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/chats/{chatId}/unarchive',
            path: {
                'session': session,
                'chatId': chatId,
            },
        });
    }
    /**
     * Unread the chat
     * @param session Session name
     * @param chatId Chat ID
     * @returns any
     * @throws ApiError
     */
    public static chatsControllerUnreadChat(
        session: any,
        chatId: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/{session}/chats/{chatId}/unread',
            path: {
                'session': session,
                'chatId': chatId,
            },
        });
    }
}
