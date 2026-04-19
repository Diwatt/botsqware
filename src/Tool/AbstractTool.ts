import { createTool, type Tool } from '@mastra/core/tools';
import type { z } from 'zod';

export abstract class AbstractTool<TIn extends z.ZodTypeAny, TOut extends z.ZodTypeAny> {
    public readonly id: string;

    public readonly mastraTool: Tool;

    protected constructor(id: string, description: string, inputSchema: TIn, outputSchema: TOut) {
        this.id = id;
        this.mastraTool = createTool({
            id,
            description,
            inputSchema,
            outputSchema,
            execute: this.execute.bind(this),
        }) as unknown as Tool;
    }

    protected abstract execute(input: z.infer<TIn>): Promise<z.infer<TOut>>;
}
