-- 001_init.sql
-- Initial schema for gig-agent project

-- ensure pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- enums
CREATE TYPE task_type AS ENUM ('send_email','review_venue','follow_up','acknowledge');
CREATE TYPE task_status AS ENUM (
    'pending',
    'awaiting_human',
    'approved',
    'edited',
    'manual',
    'cancelled',
    'expired',
    'done'
);

-- venues table
CREATE TABLE venues (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    city text,
    capacity integer,
    genre_tags text[] DEFAULT '{}',
    contact_email text,
    booker_name text,
    relevance_score real,
    score_rationale text,
    embedding vector(1536),
    source_url text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- search_runs table
CREATE TABLE search_runs (
    id bigserial PRIMARY KEY,
    query text NOT NULL,
    region text,
    status text,
    band_profile_snapshot jsonb,
    results_count integer,
    created_at timestamptz NOT NULL DEFAULT now(),
    finished_at timestamptz
);

-- tasks table
CREATE TABLE tasks (
    id bigserial PRIMARY KEY,
    type task_type NOT NULL,
    status task_status NOT NULL DEFAULT 'pending',
    venue_id bigint REFERENCES venues(id) ON DELETE SET NULL,
    payload jsonb,
    reminder_count integer DEFAULT 0,
    expires_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    resolved_at timestamptz
);

-- outreach table
CREATE TABLE outreach (
    id bigserial PRIMARY KEY,
    venue_id bigint REFERENCES venues(id) ON DELETE CASCADE,
    task_id bigint REFERENCES tasks(id) ON DELETE CASCADE,
    channel text,
    subject text,
    body text,
    sent_at timestamptz,
    reply_status text,
    notes text
);

-- indexes
CREATE INDEX idx_tasks_status_expires ON tasks(status, expires_at);

-- embedding similarity index for venues
-- ivfflat index requires >0 rows and vector extension
CREATE INDEX idx_venues_embedding_cosine ON venues USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- maybe additional indexes
CREATE INDEX idx_venues_genre_tags ON venues USING gin (genre_tags);
