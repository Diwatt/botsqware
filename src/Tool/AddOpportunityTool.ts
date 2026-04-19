import { z } from 'zod';

import { Container } from '../Core/Container';
import { AppLogger } from '../Core/AppLogger';
import { DirectusClient } from '../Api/DirectusClient';
import { Opportunity, OpportunitySchema } from '../Entity/Opportunity';
import { AbstractTool } from './AbstractTool';

const AddOpportunityInputSchema = OpportunitySchema.omit({ status: true });
type AddOpportunityInput = z.infer<typeof AddOpportunityInputSchema>;

const AddOpportunityOutputSchema = z.object({
    success: z.boolean(),
    id: z.number(),
    message: z.string(),
});
type AddOpportunityOutput = z.infer<typeof AddOpportunityOutputSchema>;

export class AddOpportunityTool extends AbstractTool<typeof AddOpportunityInputSchema, typeof AddOpportunityOutputSchema> {
    public constructor(
        private readonly directusClient: DirectusClient,
        private readonly logger: AppLogger,
    ) {
        super(
            'add-opportunity',
            'Saves a gig, festival, contest, or other music opportunity to the CRM for follow-up.',
            AddOpportunityInputSchema,
            AddOpportunityOutputSchema,
        );
    }

    protected async execute(input: AddOpportunityInput): Promise<AddOpportunityOutput> {
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