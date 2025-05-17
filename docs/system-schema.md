# System Architecture and Schema

This document summarises the components that make up the Unreal Learning project and defines an initial database schema for development.

## Components

- **Python API** (`app/main.py`)
  - Exposes `/ingest` and `/ask` endpoints via Flask.
  - Communicates with Eliza runtime for document processing and knowledge retrieval.
- **Eliza Runtime** (`eliza` folder)
  - Node/Bun based multi-agent system.
  - Performs ingestion, summarisation and knowledge storage.
- **Database** (PostgreSQL)
  - Stores ingested documents and summaries.
  - Keeps a log of queries made through the API.
- **Docker Environment**
  - Will run the Python API and Eliza runtime in separate containers.

## Database Schema

The following tables provide a minimal starting point:

### `documents`
| Column      | Type         | Notes                                |
|-------------|--------------|--------------------------------------|
| id          | UUID         | Primary key                          |
| content     | TEXT         | Raw text of the document             |
| summary     | TEXT         | Distilled summary from Eliza         |
| weaven      | TEXT         | Graph-based summary (optional)       |
| created_at  | TIMESTAMP    | When the document was ingested       |

### `query_log`
| Column      | Type         | Notes                                |
|-------------|--------------|--------------------------------------|
| id          | UUID         | Primary key                          |
| query       | TEXT         | Query string                         |
| result      | TEXT         | Response returned to the user        |
| created_at  | TIMESTAMP    | Time of the query                    |

These tables can be expanded as the project evolves. Migrations will be handled with standard SQL scripts or a lightweight ORM.

