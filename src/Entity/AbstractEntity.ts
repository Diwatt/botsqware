import { camelCase, mapKeys, snakeCase } from 'lodash';
import type { z } from 'zod';

export abstract class AbstractEntity<
    TProps extends Record<string, unknown>,
    TDirectusPayload extends Record<string, unknown>,
> {
    public readonly id: number;
    public readonly props: TProps;

    protected constructor(id: number | undefined, props: TProps) {
        this.id = id ?? 0;
        this.props = props;
    }

    public toPayload(): TDirectusPayload {
        return mapKeys(this.props, (_, key) => snakeCase(key)) as TDirectusPayload;
    }

    protected static parseData<T extends z.ZodRawShape>(
        schema: z.ZodObject<T>,
        data: Record<string, unknown>,
    ): z.infer<typeof schema> {
        const camelCased = mapKeys(data, (_, key) => camelCase(key)) as Record<string, unknown>;
        return schema.parse(camelCased);
    }
}
