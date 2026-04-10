import { Memory } from '@mastra/memory';
import { PgVector, PostgresStore } from '@mastra/pg';

import { AppConfig } from '../Core/AppConfig';
import { Container } from '../Core/Container';
import { LLMProvider } from './LLMProvider';

export class AgentMemory {
    private readonly storage: PostgresStore;
    private readonly vector: PgVector;
    private readonly memory: Memory;

    public constructor(config: AppConfig, provider: LLMProvider) {
        this.storage = new PostgresStore({
            id: 'mastra-storage',
            connectionString: config.databaseUrl,
        });

        // Enable Vector database for semantical search
        this.vector = new PgVector({
            id: 'mastra-vector',
            connectionString: config.databaseUrl,
        });

        this.memory = new Memory({
            storage: this.storage,
            vector: this.vector,
            embedder: provider.embedding('text-embedding-3-small'),
            options: {
                lastMessages: 20,
                workingMemory: {
                    enabled: true,
                },
                observationalMemory: true,
                semanticRecall: {
                    topK: 5,
                    messageRange: 3,
                    scope: 'resource',
                    indexConfig: {
                        type: 'hnsw',
                        metric: 'dotproduct',
                    },
                },
            },
        });
    }

    public getMemory(): Memory {
        return this.memory;
    }
}

Container.register(AgentMemory, () => new AgentMemory(Container.get(AppConfig), Container.get(LLMProvider)));