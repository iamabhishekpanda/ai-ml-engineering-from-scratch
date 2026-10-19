"""Offline Azure Functions trigger-plan validator."""
import json

MODULE = "Azure Functions for AI Workloads"
REQUIRED = ("trigger", "idempotency_key", "timeout", "dead_letter")


def validate_plan(plan):
    missing = [field for field in REQUIRED if not plan.get(field)]
    return {"module": MODULE, "valid": not missing, "missing": missing}


if __name__ == "__main__":
    print(json.dumps(validate_plan({field: field for field in REQUIRED}), indent=2))
