# Azure Identity and Networking

> Make identity, network boundaries, and service-to-service access explicit before deployment.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure AI Engineering Fundamentals
**Time:** ~60 minutes

## Learning Objectives

- Distinguish human identity, workload identity, and resource identity.
- Prefer managed identity over embedded credentials.
- Describe private endpoints, ingress, egress, and least privilege.
- Review a deployment plan for secret and network leaks.
- Test a deny-by-default policy.

## Practice

Use `code/main.py` to validate an identity and network plan. Treat every external call as a boundary that needs an owner and an audit signal.
