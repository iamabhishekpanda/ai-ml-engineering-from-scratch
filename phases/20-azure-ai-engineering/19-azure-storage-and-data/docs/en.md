# Azure Storage and Data Contracts

> Keep documents, metadata, embeddings, and lifecycle rules aligned across an AI data plane.

**Type:** Build
**Languages:** Python
**Prerequisites:** Data Management, Azure AI Search
**Time:** ~60 minutes

## Learning Objectives

- Classify source data before storing or indexing it.
- Define blob, metadata, and deletion contracts.
- Design idempotent ingestion and replay behavior.
- Separate raw, processed, and evaluation data.
- Verify retention and deletion evidence.

## Practice

Use `code/main.py` to validate a storage contract. It checks required metadata, retention, and replay fields without requiring an Azure account.
