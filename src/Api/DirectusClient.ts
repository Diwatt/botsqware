import { createDirectus, createItem, rest, staticToken } from '@directus/sdk';

import { AppConfig } from '../Core/AppConfig';
import { Container } from '../Core/Container';
import { Opportunity } from '../Entity/Opportunity';

interface DirectusSchema {
    opportunity: {
        id: number;
        name: string;
        type: string;
        city?: string;
        venue?: string;
        url?: string;
        event_at?: string;
        deadline_at?: string;
        notes?: string;
        status: string;
    }[];
}

export class DirectusClient {
    public readonly client;

    public constructor(private readonly config: AppConfig) {
        const token = this.config.directusToken;

        if (!token) {
            throw new Error('DIRECTUS_ADMIN_TOKEN environment variable is required');
        }

        this.client = createDirectus<DirectusSchema>(this.config.directusUrl).with(staticToken(token)).with(rest());
    }

    public async createOpportunity(opportunity: Opportunity): Promise<number> {
        const result = await this.client.request(createItem('opportunity', opportunity.toPayload()));

        return result.id;
    }
}

Container.register(DirectusClient, () => new DirectusClient(Container.get(AppConfig)));
