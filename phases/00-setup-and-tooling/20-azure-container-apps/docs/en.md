# Azure Container Apps

> Package an AI API and worker with health checks, revisions, scaling signals, and a rollback path.

**Type:** Build
**Languages:** Python
**Prerequisites:** Docker for AI, Azure Identity and Networking
**Time:** ~60 minutes

## Learning Objectives

- Separate API, worker, and scheduled job containers.
- Define readiness and liveness checks.
- Choose scaling signals for model and retrieval workloads.
- Use revisions for controlled rollout and rollback.
- Keep configuration and secrets outside the image.

## Practice

Use `code/main.py` to validate a container deployment manifest. It checks health probes, revision strategy, and non-secret configuration.
