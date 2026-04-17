import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

import { Container } from '../Core/Container';
import { DirectusClient } from '../Api/DirectusClient';
import { Opportunity } from '../Entity/Opportunity';

const AddOpportunityInputSchema = z.object({
    name: z.string().describe('Event, festival, or contest name'),
    type: z.enum(['gig', 'contest', 'festival', 'residency', 'other']).describe('Type of opportunity'),
    city: z.string().optional().describe('City where the event takes place'),
    venue: z.string().optional().describe('Venue or location name'),
    url: z.string().url().optional().describe('URL link to the event or registration page'),
    eventAt: z.string().optional().describe('Event date and time in ISO 8601 format (e.g., 2024-12-31T20:00:00Z)'),
    deadlineAt: z.string().optional().describe('Application deadline in ISO 8601 format (e.g., 2024-11-30T23:59:00Z)'),
    notes: z.string().optional().describe('Additional context or notes about the opportunity'),
});

type AddOpportunityInput = z.infer<typeof AddOpportunityInputSchema>;

const AddOpportunityOutputSchema = z.object({
    success: z.boolean(),
    id: z.number(),
    message: z.string(),
});

type AddOpportunityOutput = z.infer<typeof AddOpportunityOutputSchema>;

export class AddOpportunityTool {
    public readonly tool;

    public constructor(private readonly directusClient: DirectusClient) {
        this.tool = createTool({
            id: 'add-opportunity',
            description: 'Saves a gig, festival, contest, or other music opportunity to the CRM for follow-up.',
            inputSchema: AddOpportunityInputSchema,
            outputSchema: AddOpportunityOutputSchema,
            execute: this.execute.bind(this),
        });
    }

    private async execute(input: AddOpportunityInput): Promise<AddOpportunityOutput> {
        const opportunity = Opportunity.create(input);
        const id = await this.directusClient.createOpportunity(opportunity);

        return { success: true, id, message: 'Opportunity saved successfully' };
    }
}

Container.register(AddOpportunityTool, () => new AddOpportunityTool(Container.get(DirectusClient)));
