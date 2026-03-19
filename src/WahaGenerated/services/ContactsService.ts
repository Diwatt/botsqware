/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactRequest } from '../models/ContactRequest';
import type { ContactUpdateBody } from '../models/ContactUpdateBody';
import type { CountResponse } from '../models/CountResponse';
import type { LidToPhoneNumber } from '../models/LidToPhoneNumber';
import type { Result } from '../models/Result';
import type { WANumberExistResult } from '../models/WANumberExistResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContactsService {
    /**
     * Get all contacts
     * @param session
     * @param sortBy Sort by field
     * @param sortOrder Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)
     * @param limit
     * @param offset
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerGetAll(
        session: string = 'default',
        sortBy?: 'id' | 'name',
        sortOrder?: 'desc' | 'asc',
        limit?: number,
        offset?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contacts/all',
            query: {
                'session': session,
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Get contact basic info
     * The method always return result, even if the phone number is not registered in WhatsApp. For that - use /contacts/check-exists endpoint below.
     * @param contactId
     * @param session
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerGet(
        contactId: string,
        session: string = 'default',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contacts',
            query: {
                'contactId': contactId,
                'session': session,
            },
        });
    }
    /**
     * Check phone number is registered in WhatsApp.
     * @param phone The phone number to check
     * @param session
     * @returns WANumberExistResult
     * @throws ApiError
     */
    public static contactsControllerCheckExists(
        phone: string,
        session: string = 'default',
    ): CancelablePromise<WANumberExistResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contacts/check-exists',
            query: {
                'phone': phone,
                'session': session,
            },
        });
    }
    /**
     * Gets the Contact's "about" info
     * Returns null if you do not have permission to read their status.
     * @param contactId
     * @param session
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerGetAbout(
        contactId: string,
        session: string = 'default',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contacts/about',
            query: {
                'contactId': contactId,
                'session': session,
            },
        });
    }
    /**
     * Get contact's profile picture URL
     * If privacy settings do not allow to get the picture, the method will return null.
     * @param contactId
     * @param refresh Refresh the picture from the server (24h cache by default). Do not refresh if not needed, you can get rate limit error
     * @param session
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerGetProfilePicture(
        contactId: string,
        refresh: boolean = false,
        session: string = 'default',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contacts/profile-picture',
            query: {
                'contactId': contactId,
                'refresh': refresh,
                'session': session,
            },
        });
    }
    /**
     * Block contact
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerBlock(
        requestBody: ContactRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contacts/block',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Unblock contact
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerUnblock(
        requestBody: ContactRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contacts/unblock',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get contact basic info
     * The method always return result, even if the phone number is not registered in WhatsApp. For that - use /contacts/check-exists endpoint below.
     * @param session Session name
     * @param id Contact ID
     * @returns any
     * @throws ApiError
     */
    public static contactsSessionControllerGet(
        session: any,
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/contacts/{id}',
            path: {
                'session': session,
                'id': id,
            },
        });
    }
    /**
     * Create or update contact
     * Create or update contact on the phone address book. May not work if you have installed many WhatsApp apps on the same phone
     * @param session Session name
     * @param chatId Chat ID
     * @param requestBody
     * @returns Result
     * @throws ApiError
     */
    public static contactsSessionControllerPut(
        session: any,
        chatId: string,
        requestBody: ContactUpdateBody,
    ): CancelablePromise<Result> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/{session}/contacts/{chatId}',
            path: {
                'session': session,
                'chatId': chatId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all known lids to phone number mapping
     * @param session Session name
     * @param limit
     * @param offset
     * @returns LidToPhoneNumber
     * @throws ApiError
     */
    public static lidsControllerGetAll(
        session: any,
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<LidToPhoneNumber>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/lids',
            path: {
                'session': session,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Get the number of known lids
     * @param session Session name
     * @returns CountResponse
     * @throws ApiError
     */
    public static lidsControllerGetLidsCount(
        session: any,
    ): CancelablePromise<CountResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/lids/count',
            path: {
                'session': session,
            },
        });
    }
    /**
     * Get phone number by lid
     * @param session Session name
     * @param lid
     * @returns LidToPhoneNumber
     * @throws ApiError
     */
    public static lidsControllerFindPnByLid(
        session: any,
        lid: string,
    ): CancelablePromise<LidToPhoneNumber> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/lids/{lid}',
            path: {
                'session': session,
                'lid': lid,
            },
        });
    }
    /**
     * Get lid by phone number (chat id)
     * @param session Session name
     * @param phoneNumber
     * @returns LidToPhoneNumber
     * @throws ApiError
     */
    public static lidsControllerFindLidByPhoneNumber(
        session: any,
        phoneNumber: string,
    ): CancelablePromise<LidToPhoneNumber> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/{session}/lids/pn/{phoneNumber}',
            path: {
                'session': session,
                'phoneNumber': phoneNumber,
            },
        });
    }
}
