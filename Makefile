.ONESHELL:
SHELL := /bin/bash

# Makefile for running development stack and one-off commands

# start PostgreSQL/Redis/pgvector using docker-compose
UP_CMD=docker-compose up -d
DOWN_CMD=docker-compose down

.PHONY: up down dev agent

up:
	@echo "Starting development services (Postgres, Redis, pgvector)..."
	$(UP_CMD)

# tear down containers

down:
	@echo "Stopping development services..."
	$(DOWN_CMD)

# run the gig agent once with a trivial example
agent:
	@echo "Running GigAgent once (example invocation)"
	python scripts/run_agent.py

# convenience target: bring up services and run agent

dev: up agent
	@echo "Development environment ready."
