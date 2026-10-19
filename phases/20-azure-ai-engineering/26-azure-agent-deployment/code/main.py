"""Offline Azure agent deployment-plan validator."""
import json

MODULE = "Azure Agent Deployment"
REQUIRED = ("state", "tool_permission", "approval_gate", "recovery")


def validate_plan(plan):
    missing = [field for field in REQUIRED if not plan.get(field)]
    return {"module": MODULE, "valid": not missing, "missing": missing}


if __name__ == "__main__":
    print(json.dumps(validate_plan({field: field for field in REQUIRED}), indent=2))
