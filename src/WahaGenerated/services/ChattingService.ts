/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatRequest } from '../models/ChatRequest';
import type { MessageButtonReply } from '../models/MessageButtonReply';
import type { MessageContactVcardRequest } from '../models/MessageContactVcardRequest';
import type { MessageFileRequest } from '../models/MessageFileRequest';
import type { MessageForwardRequest } from '../models/MessageForwardRequest';
import type { MessageImageRequest } from '../models/MessageImageRequest';
import type { MessageLinkCustomPreviewRequest } from '../models/MessageLinkCustomPreviewRequest';
import type { MessageLinkPreviewRequest } from '../models/MessageLinkPreviewRequest';
import type { MessageLocationRequest } from '../models/MessageLocationRequest';
import type { MessagePollRequest } from '../models/MessagePollRequest';
import type { MessagePollVoteRequest } from '../models/MessagePollVoteRequest';
import type { MessageReactionRequest } from '../models/MessageReactionRequest';
import type { MessageReplyRequest } from '../models/MessageReplyRequest';
import type { MessageStarRequest } from '../models/MessageStarRequest';
import type { MessageTextRequest } from '../models/MessageTextRequest';
import type { MessageVideoRequest } from '../models/MessageVideoRequest';
import type { MessageVoiceRequest } from '../models/MessageVoiceRequest';
import type { SendButtonsRequest } from '../models/SendButtonsRequest';
import type { SendListRequest } from '../models/SendListRequest';
import type { SendSeenRequest } from '../models/SendSeenRequest';
import type { WAMessage } from '../models/WAMessage';
import type { WANumberExistResult } from '../models/WANumberExistResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChattingService {
    /**
     * Send a text message
     * @param requestBody
     * @returns WAMessage
     * @throws ApiError
     */
    public static chattingControllerSendText(
        requestBody: MessageTextRequest,
    ): CancelablePromise<WAMessage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendText',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @deprecated
     * Send a text message
     * @param phone
     * @param text
     * @param session
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendTextGet(
        phone: string,
        text: string,
        session: string = 'default',
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sendText',
            query: {
                'phone': phone,
                'text': text,
                'session': session,
            },
        });
    }
    /**
     * Send an image
     * Either from an URL or base64 data - look at the request schemas for details.
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendImage(
        requestBody: MessageImageRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendImage',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send a file
     * Either from an URL or base64 data - look at the request schemas for details.
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendFile(
        requestBody: MessageFileRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendFile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send an voice message
     * Either from an URL or base64 data - look at the request schemas for details.
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendVoice(
        requestBody: MessageVoiceRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendVoice',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send a video
     * Either from an URL or base64 data - look at the request schemas for details.
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendVideo(
        requestBody: MessageVideoRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendVideo',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send a text message with a CUSTOM link preview.
     * You can use regular /api/sendText if you wanna send auto-generated link preview.
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendLinkCustomPreview(
        requestBody: MessageLinkCustomPreviewRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/send/link-custom-preview',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @deprecated
     * Send buttons message (interactive)
     * Send Buttons
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendButtons(
        requestBody: SendButtonsRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendButtons',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send a list message (interactive)
     * Send a List message with sections and rows
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendList(
        requestBody: SendListRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendList',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns WAMessage
     * @throws ApiError
     */
    public static chattingControllerForwardMessage(
        requestBody: MessageForwardRequest,
    ): CancelablePromise<WAMessage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/forwardMessage',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendSeen(
        requestBody: SendSeenRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendSeen',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerStartTyping(
        requestBody: ChatRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/startTyping',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerStopTyping(
        requestBody: ChatRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/stopTyping',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * React to a message with an emoji
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSetReaction(
        requestBody: MessageReactionRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/reaction',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Star or unstar a message
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSetStar(
        requestBody: MessageStarRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/star',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send a poll with options
     * You can use it as buttons or list replacement
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendPoll(
        requestBody: MessagePollRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendPoll',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Vote on a poll
     * Cast vote(s) on an existing poll message
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendPollVote(
        requestBody: MessagePollVoteRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendPollVote',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendLocation(
        requestBody: MessageLocationRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendLocation',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendContactVcard(
        requestBody: MessageContactVcardRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendContactVcard',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Reply on a button message
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendButtonsReply(
        requestBody: MessageButtonReply,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/send/buttons/reply',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @deprecated
     * Get messages in a chat
     * DEPRECATED. Use "GET /api/chats/{id}/messages" instead
     * @param chatId
     * @param sortBy Sort by field
     * @param sortOrder Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)
     * @param downloadMedia Download media for messages
     * @param merge Merge LID (@lid) and phone-number (@c.us) chats referencing the same contact
     * @param session
     * @param limit
     * @param offset
     * @param filterTimestampLte Filter messages before this timestamp (inclusive)
     * @param filterTimestampGte Filter messages after this timestamp (inclusive)
     * @param filterFromMe From me filter (by default shows all messages)
     * @param filterAck Filter messages by acknowledgment status
     * @returns WAMessage
     * @throws ApiError
     */
    public static chattingControllerGetMessages(
        chatId: string,
        sortBy: 'timestamp' | 'messageTimestamp' = 'timestamp',
        sortOrder?: 'desc' | 'asc',
        downloadMedia: boolean = true,
        merge: boolean = true,
        session: string = 'default',
        limit: number = 10,
        offset?: number,
        filterTimestampLte?: number,
        filterTimestampGte?: number,
        filterFromMe?: boolean,
        filterAck?: 'ERROR' | 'PENDING' | 'SERVER' | 'DEVICE' | 'READ' | 'PLAYED',
    ): CancelablePromise<Array<WAMessage>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/messages',
            query: {
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'downloadMedia': downloadMedia,
                'merge': merge,
                'chatId': chatId,
                'session': session,
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
     * @deprecated
     * Check number status
     * DEPRECATED. Use "POST /contacts/check-exists" instead
     * @param phone The phone number to check
     * @param session
     * @returns WANumberExistResult
     * @throws ApiError
     */
    public static chattingControllerDeprecatedCheckNumberStatus(
        phone: string,
        session: string = 'default',
    ): CancelablePromise<WANumberExistResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/checkNumberStatus',
            query: {
                'phone': phone,
                'session': session,
            },
        });
    }
    /**
     * @deprecated
     * DEPRECATED - you can set "reply_to" field when sending text, image, etc
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerReply(
        requestBody: MessageReplyRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/reply',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @deprecated
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static chattingControllerSendLinkPreviewDeprecated(
        requestBody: MessageLinkPreviewRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sendLinkPreview',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
