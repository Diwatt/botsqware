import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

import { Container } from '../Core/Container';
import { AppLogger } from '../Core/AppLogger';
import { DirectusClient } from '../Api/DirectusClient';
import { Opportunity, OpportunitySchema } from '../Entity/Opportunity';

const AddOpportunityInputSchema = OpportunitySchema.omit({ status: true });
type AddOpportunityInput = z.infer<typeof AddOpportunityInputSchema>;

const AddOpportunityOutputSchema = z.object({
    success: z.boolean(),
    id: z.number(),
    message: z.string(),
});
type AddOpportunityOutput = z.infer<typeof AddOpportunityOutputSchema>;

export class AddOpportunityTool {
    public readonly tool;

    public constructor(
        private readonly directusClient: DirectusClient,
        private readonly logger: AppLogger,
    ) {
        this.tool = createTool({
            id: 'add-opportunity',
            description: 'Saves a gig, festival, contest, or other music opportunity to the CRM for follow-up.',
            inputSchema: AddOpportunityInputSchema,
            outputSchema: AddOpportunityOutputSchema,
            execute: this.execute.bind(this),
        });
    }

    private async execute(input: AddOpportunityInput): Promise<AddOpportunityOutput> {
        this.logger.sys.info('🚀 [TOOL TRIGGERED] add-opportunity called with:', { input });

        const opportunity = Opportunity.create(input);

        try {
            const id = await this.directusClient.createOpportunity(opportunity);
            this.logger.sys.info('✅ [DIRECTUS SUCCESS] Inserted ID:', { id });

            return { success: true, id, message: 'Opportunity saved successfully' };
        } catch (error) {
            this.logger.sys.error('❌ [DIRECTUS ERROR]:', { error });
            throw error;
        }
    }
}

Container.register(AddOpportunityTool, () => new AddOpportunityTool(Container.get(DirectusClient), Container.get(AppLogger)));