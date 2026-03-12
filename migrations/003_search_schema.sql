-- Migration: 003_search_schema.sql
-- Purpose: Add search_queries table and extend venues schema for iterative search

-- Create search_queries table
CREATE TABLE search_queries (
    id SERIAL PRIMARY KEY,
    query_text VARCHAR(500) NOT NULL,
    source VARCHAR(100) NOT NULL,  -- duckduckgo, fedelima.org, etc.
    zone VARCHAR(255) NOT NULL,     -- geo_wave: 'Nantes centre', etc.
    wave_number INTEGER NOT NULL,   -- wave index (0-8 for 9 zones)
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    results_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',  -- pending, completed, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_queries_source ON search_queries(source);
CREATE INDEX idx_search_queries_zone ON search_queries(zone);
CREATE INDEX idx_search_queries_wave ON search_queries(wave_number);
CREATE INDEX idx_search_queries_status ON search_queries(status);
CREATE INDEX idx_search_queries_executed_at ON search_queries(executed_at);

-- Extend venues table with search context
ALTER TABLE venues ADD COLUMN IF NOT EXISTS source_type VARCHAR(100);
    -- 'duckduckgo', 'fedelima.org', 'sma-syndicat.org', etc.

ALTER TABLE venues ADD COLUMN IF NOT EXISTS programming_evidence TEXT;
    -- Notes on venue programming: "Hosts monthly jazz nights", etc.

ALTER TABLE venues ADD COLUMN IF NOT EXISTS contact_channel VARCHAR(100);
    -- 'email', 'phone', 'instagram', 'facebook', 'website_form', 'unknown'

ALTER TABLE venues ADD COLUMN IF NOT EXISTS drive_minutes INTEGER;
    -- Estimated driving time from band base city (Nantes)

ALTER TABLE venues ADD COLUMN IF NOT EXISTS wave_found SMALLINT;
    -- Which geo_wave index this venue was found in (0-8)

-- Create index for efficient wave-based searches
CREATE INDEX IF NOT EXISTS idx_venues_wave_found ON venues(wave_found);
CREATE INDEX IF NOT EXISTS idx_venues_drive_minutes ON venues(drive_minutes);
CREATE INDEX IF NOT EXISTS idx_venues_contact_channel ON venues(contact_channel);
