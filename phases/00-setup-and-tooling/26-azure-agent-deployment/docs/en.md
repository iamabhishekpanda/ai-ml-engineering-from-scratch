# Azure Agent Deployment

> Deploy tool-using agents with explicit state, permissions, approvals, timeouts, and recovery paths.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Functions for AI Workloads, Azure Security and Secrets
**Time:** ~75 minutes

## Learning Objectives

- Model an agent as a state machine with bounded transitions.
- Apply tool permissions per task and user context.
- Add approval gates for irreversible actions.
- Recover from timeouts, duplicate events, and partial tool failure.
- Trace every decision without storing sensitive payloads.

## Practice

Use `code/main.py` to validate an agent deployment plan. Every tool edge needs permission, timeout, retry, and audit behavior.
