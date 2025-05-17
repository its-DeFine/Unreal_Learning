# Eliza Integration PRD

This document expands on [docs/PRD.md](PRD.md) with specific requirements and plans for leveraging **elizaOS** within the project.

## Overview
Our goal is to augment the existing microservice architecture with Eliza's multi-agent runtime, enabling document ingestion, summarisation, and knowledge retrieval. Eliza runs in its own Node/Bun environment and communicates with the Python services via HTTP.

## Goals
- **Use Eliza for Document Processing**: Utilize Eliza's ingest and memory system to store and summarise uploaded content.
- **Multi-Agent Workflows**: Support multiple Eliza agents that can collaborate or operate independently.
- **Extensible Plugins**: Rely on Eliza's plugin system (e.g., OpenAI, Discord) to extend functionality without rewriting existing features.

## Requirements
1. **Environment Setup**
   - Node.js 23+ and [bun](https://bun.sh/docs/installation) are required to run Eliza.
   - Python remains the language for the API layer (see [`app/main.py`](../app/main.py)).
   - Provide Docker instructions for running both Eliza and the Python app together.
2. **Eliza Runtime**
   - Use the code already present in the `eliza` folder.
   - Configure agents and environment variables in `eliza/.env`.
   - Expose an API endpoint or CLI command that the Python service can call for ingest and query operations.
3. **API Integration**
   - `/ingest` endpoint sends documents to Eliza for processing and returns summaries when `return_format` > 0.
   - `/ask` endpoint queries Eliza's stored knowledge and returns the result to the user.

## Plan
1. **Local Development**
   - Build and start Eliza using `bun install && bun run build && bun start`.
   - Run the Flask service in parallel, connecting to Eliza via HTTP.
2. **Dockerisation**
   - Create a multi-container setup in `docker-compose.yaml` with one service for Eliza and one for the Python API.
   - Ensure environment variables for both containers are documented.
3. **Testing**
   - Add integration tests to verify that the Python endpoints correctly call Eliza.

## Open Questions
- Which Eliza plugins are required for a minimal deployment?
- Should the Python service handle authentication or delegate it to Eliza?

