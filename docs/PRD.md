# Product Requirements Document (PRD)

## Overview
This project aims to build a containerized application environment using **elizaOS** as the base operating system. The goal is to deploy the application as a Docker cluster. The `v2-develop` branch of elizaOS is required for the environment.

## Goals
- Integrate elizaOS `v2-develop` into the project.
- Run the application within a Docker cluster for scalability and easy deployment.
- Reuse existing components whenever possible to reduce development effort.

## Non-Goals
- Rewriting features already available in elizaOS.
- Building a custom orchestration platform (we rely on Docker).

## Requirements
1. **elizaOS Integration**
   - Clone the elizaOS repository, checkout the `v2-develop` branch, and install according to project documentation.
   - Provide scripts or instructions for setting up elizaOS locally and in the Docker environment.
2. **Application Architecture**
   - Containerized microservices that can be scaled in a cluster.
   - Use Docker Compose or similar tooling for local development.
3. **Deployment**
   - Support for Docker swarm or another cluster orchestrator.
   - Provide environment configuration files.

## Functional Requirements
1. **Ingest API**
   - Accepts a `return_format` parameter:
     - `0`: perform vanilla ingest without immediate feedback.
     - `1`: return distilled learning output immediately to the user.
     - `2`: return distilled output plus a "weaven" distilled summary.
   - The ingest endpoint should reuse existing elizaOS components for
     summarisation and graph weaving wherever possible.
2. **Query API**
   - Provide an endpoint that allows users to request abstract information
     from stored knowledge at any time. This process is separate from the
     automatic ingest feedback.

## Plan
1. Attempt to clone and install elizaOS `v2-develop`.
2. Document installation steps in the project README.
3. Create initial Docker configuration files.
4. Build minimal microservice to validate the stack.

## Open Questions
- Is elizaOS actively maintained, and does it support Docker out of the box?
- Which orchestration solution will be used in production? (Docker Swarm vs. Kubernetes)

