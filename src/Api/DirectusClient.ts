import { createDirectus, createItem, rest, staticToken } from '@directus/sdk';

import { AppConfig } from '../Core/AppConfig';
import { Container } from '../Core/Container';
import type { SnakeCasedProperties } from '../Entity/AbstractEntity';
import type { Opportunity, OpportunityProps } from '../Entity/Opportunity';
import { ApplicationConfigurationException } from '../Exception';

interface DirectusSchema {
    opportunity: (SnakeCasedProperties<OpportunityProps> & { id: number })[];
}

export class DirectusClient {
    public readonly client;

    public constructor(private readonly config: AppConfig) {
        const token = this.config.directusToken;

        if (!token) {
            throw new ApplicationConfigurationException('DIRECTUS_ADMIN_TOKEN environment variable is required');
        }

        this.client = createDirectus<DirectusSchema>(this.config.directusUrl).with(staticToken(token)).with(rest());
    }

    public async createOpportunity(opportunity: Opportunity): Promise<number> {
        const result = await this.client.request(createItem('opportunity', opportunity.toPayload()));

        return result.id;
    }
}

Container.register(DirectusClient, () => new DirectusClient(Container.get(AppConfig)));
