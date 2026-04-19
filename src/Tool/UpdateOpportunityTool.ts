import { z } from 'zod';

import { AppLogger } from '../Core/AppLogger';
import { Container } from '../Core/Container';
import { DirectusClient } from '../Api/DirectusClient';
import { OpportunitySchema } from '../Entity/Opportunity';
import { AbstractTool } from './AbstractTool';

const UpdateOpportunityInputSchema = OpportunitySchema.partial().extend({
    id: z.number().describe('The strict ID of the opportunity to update'),
});

const UpdateOpportunityOutputSchema = z.object({
    success: z.boolean(),
    id: z.number(),
    message: z.string(),
});

export class UpdateOpportunityTool extends AbstractTool<typeof UpdateOpportunityInputSchema, typeof UpdateOpportunityOutputSchema> {
    public constructor(
        private readonly directusClient: DirectusClient,
        private readonly logger: AppLogger,
    ) {
        super(
            'update-opportunity',
            'Updates an existing music opportunity in the CRM. Requires the opportunity ID.',
            UpdateOpportunityInputSchema,
            UpdateOpportunityOutputSchema,
        );
    }

    protected async execute(input: z.infer<typeof UpdateOpportunityInputSchema>): Promise<z.infer<typeof UpdateOpportunityOutputSchema>> {
        this.logger.sys.info('🚀 [TOOL TRIGGERED] update-opportunity called with:', { input });

        const { id, ...data } = input;

        try {
            await this.directusClient.updateOpportunity(id, data);
            this.logger.sys.info('✅ [DIRECTUS SUCCESS] Updated ID:', { id });

            return { success: true, id, message: 'Opportunity updated successfully' };
        } catch (error) {
            this.logger.sys.error('❌ [DIRECTUS ERROR]:', { error });
            throw error;
        }
    }
}

Container.register(UpdateOpportunityTool, () => new UpdateOpportunityTool(Container.get(DirectusClient), Container.get(AppLogger)));