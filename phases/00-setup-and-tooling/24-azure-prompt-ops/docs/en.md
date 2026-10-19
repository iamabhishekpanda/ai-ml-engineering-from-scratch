# Azure Prompt Operations

> Treat prompts, model settings, safety rules, and evaluation results as versioned production inputs.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure OpenAI, Azure AI Foundry
**Time:** ~60 minutes

## Learning Objectives

- Version prompts and model parameters together.
- Build a small regression dataset before changing a prompt.
- Compare quality, latency, refusal, and token-cost effects.
- Require approval for production prompt changes.
- Keep rollback metadata beside each release.

## Practice

Use `code/main.py` to validate a prompt release record. A release needs a dataset, threshold, owner, and rollback version.
