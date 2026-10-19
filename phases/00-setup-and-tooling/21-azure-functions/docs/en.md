# Azure Functions for AI Workloads

> Use event-driven functions for bounded tasks, ingestion triggers, and lightweight orchestration.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Container Apps, APIs & Keys
**Time:** ~60 minutes

## Learning Objectives

- Choose functions for bounded, event-driven work.
- Define trigger, retry, timeout, and poison-message behavior.
- Keep handlers idempotent and observable.
- Avoid placing long model jobs in a short request path.
- Design a durable handoff to a worker.

## Practice

Use `code/main.py` to validate a function trigger plan. It checks idempotency, timeout, retry, and dead-letter decisions.
