-- 002_search_schedules.sql
-- Table for storing recurring search schedules

CREATE TABLE search_schedules (
    id bigserial PRIMARY KEY,
    cron_expr text NOT NULL,
    query text NOT NULL,
    region text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_search_schedules_cron ON search_schedules (cron_expr);
