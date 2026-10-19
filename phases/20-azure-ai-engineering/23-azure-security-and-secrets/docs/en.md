# Azure Security and Secrets

> Protect identities, prompts, documents, and model outputs across the full AI system boundary.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Identity and Networking, Azure Storage and Data
**Time:** ~60 minutes

## Learning Objectives

- Classify prompt, document, embedding, and output sensitivity.
- Store secrets in Key Vault and access them through managed identity.
- Apply least privilege to data and model resources.
- Test prompt injection, data exfiltration, and unsafe tool use.
- Define audit and rotation evidence.

## Practice

Use `code/main.py` to validate a security plan. It rejects plaintext secrets and missing ownership for sensitive data paths.
