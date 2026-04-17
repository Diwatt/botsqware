import { camelCase, mapKeys, snakeCase } from 'lodash';
import type { z } from 'zod';

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
    : S;

export type SnakeCasedProperties<T> = {
    [K in keyof T as CamelToSnakeCase<string & K>]: T[K];
};

export abstract class AbstractEntity<TProps extends Record<string, unknown>> {
    public readonly id: number;
    public readonly props: TProps;

    protected constructor(id: number | undefined, props: TProps) {
        this.id = id ?? 0;
        this.props = props;
    }

    public toPayload(): SnakeCasedProperties<TProps> {
        return mapKeys(this.props, (_, key) => snakeCase(key)) as SnakeCasedProperties<TProps>;
    }

    protected static parseData<T extends z.ZodRawShape>(
        schema: z.ZodObject<T>,
        data: Record<string, unknown>,
    ): z.infer<typeof schema> {
        const camelCased = mapKeys(data, (_, key) => camelCase(key)) as Record<string, unknown>;
        return schema.parse(camelCased);
    }
}