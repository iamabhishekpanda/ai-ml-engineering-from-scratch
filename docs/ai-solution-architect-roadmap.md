# AI Solution Architect Roadmap

> A practical extension for designing, deploying, evaluating, and operating AI systems.

This roadmap extends the first-principles curriculum with provider and framework skills that are not yet represented as dedicated phase lessons.

## Read Next

1. Complete the math, Python, machine learning, transformer, retrieval, and agent-engineering phases.
2. Read the repository lessons on APIs, security, evaluation, observability, and deployment.
3. Build the [retrieval evaluation lab](../projects/retrieval-evaluation-lab/README.md).
4. Build the [agent trace debugger](../projects/agent-trace-debugger/README.md).
5. Use the sequence below for the Azure and framework extension.

## Extension Modules

### 1. Architecture and requirements

- Convert product requirements into quality attributes and measurable budgets.
- Draw context, container, data-flow, and deployment views.
- Record decisions, alternatives, failure modes, and ownership.
- Define identity, secrets, network boundaries, data retention, and audit evidence.

### 2. Azure AI delivery

- Use Azure AI Foundry and Azure OpenAI for model access and evaluation workflows.
- Use Azure Container Apps or Azure Functions for stateless API and worker deployment.
- Use Azure AI Search for hybrid retrieval and Blob Storage for source documents.
- Use Microsoft Entra ID, managed identities, Key Vault, private networking, and RBAC.
- Add Application Insights, Log Analytics, budgets, quotas, retries, and deployment gates.

A production exercise should deploy the same service locally and to Azure with environment-specific configuration. Keep secrets out of source control. Use managed identity in Azure.

### 3. LangChain and LangGraph

- Use LangChain for model, prompt, retriever, parser, and tool composition.
- Use LangGraph for explicit state, durable checkpoints, human approval, retries, and branching.
- Keep framework adapters behind small interfaces so the core domain logic stays testable.
- Test tool permissions, malformed outputs, timeouts, duplicate events, and recovery paths.

### 4. LangSmith evaluation and operations

- Trace model calls, retrieval, tools, state transitions, and user-visible outputs.
- Build datasets for correctness, groundedness, refusal behavior, latency, and cost.
- Run offline experiments before promotion, then sample production traces for drift.
- Version prompts and graphs. Keep evaluation evidence with each release.

### 5. Architect capstone

Build a secure RAG or multi-agent service with:

- an architecture decision record;
- a threat model and data classification;
- local and Azure deployment manifests;
- retrieval and answer-quality evaluations;
- LangSmith traces and regression datasets;
- dashboards, alerts, budgets, and an incident runbook;
- a rollback plan and a short design review.

## Definition Of Done

The solution is ready for review when another engineer can understand the boundaries, deploy it, reproduce the evaluation, inspect a trace, rotate a secret, and recover from a failed model or tool call.
