import { z } from 'zod';

import { AbstractEntity } from './AbstractEntity';

export const OpportunityTypeSchema = z.enum(['gig', 'contest', 'festival', 'residency', 'other']);
export type OpportunityType = z.infer<typeof OpportunityTypeSchema>;

export const OpportunityStatusSchema = z.enum(['to_contact', 'contacted', 'confirmed', 'declined', 'archived']);
export type OpportunityStatus = z.infer<typeof OpportunityStatusSchema>;

export const OpportunitySchema = z.object({
    name: z.string().describe('Event, festival, or contest name'),
    type: OpportunityTypeSchema.describe('Type of opportunity'),
    city: z.string().optional().describe('City where the event takes place'),
    venue: z.string().optional().describe('Venue or location name'),
    url: z.string().url().optional().describe('URL link to the event or registration page'),
    eventAt: z.string().optional().describe('Event date and time in ISO 8601 format (e.g., 2024-12-31T20:00:00Z)'),
    deadlineAt: z.string().optional().describe('Application deadline in ISO 8601 format (e.g., 2024-11-30T23:59:00Z)'),
    notes: z.string().optional().describe('Additional context or notes about the opportunity'),
    status: OpportunityStatusSchema.default('to_contact').describe('Current status of the opportunity'),
});

export type OpportunityProps = z.infer<typeof OpportunitySchema>;

export class Opportunity extends AbstractEntity<OpportunityProps> {
    private constructor(id: number | undefined, props: OpportunityProps) {
        super(id, props);
    }

    public static fromPayload(data: Record<string, unknown>): Opportunity {
        const id = typeof data.id === 'number' ? data.id : undefined;
        return new Opportunity(id, AbstractEntity.parseData(OpportunitySchema, data));
    }

    public static create(dto: Record<string, unknown>): Opportunity {
        return new Opportunity(undefined, OpportunitySchema.parse(dto));
    }
}