# Azure AI Foundry

> Treat experiments, evaluations, model versions, and deployments as one traceable promotion path.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure OpenAI
**Time:** ~60 minutes

## Learning Objectives

- Define an experiment, dataset, run, and promotion decision.
- Keep evaluation evidence attached to a model or prompt version.
- Compare candidate deployments with fixed test data.
- Separate development, staging, and production resources.
- Stop promotion when a quality or safety gate fails.

## Practice

Use `code/main.py` to validate a promotion record. Every candidate needs an owner, dataset, threshold, and rollback target.
