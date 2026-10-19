"""Offline Azure OpenAI request-plan validator."""
import json

MODULE = "Azure OpenAI"
REQUIRED = ("deployment_name", "token_budget", "retry_policy", "safety_policy")


def validate_plan(plan):
    missing = [field for field in REQUIRED if not plan.get(field)]
    return {"module": MODULE, "valid": not missing, "missing": missing}


if __name__ == "__main__":
    print(json.dumps(validate_plan({field: field for field in REQUIRED}), indent=2))
