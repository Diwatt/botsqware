/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RequestCodeRequest = {
    /**
     * Mobile phone number in international format
     */
    phoneNumber: string;
    /**
     * How would you like to receive the one time code for registration? |sms|voice. Leave empty for Web pairing.
     */
    method?: string;
};

