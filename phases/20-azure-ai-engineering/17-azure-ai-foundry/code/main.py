"""Offline Azure AI Foundry promotion-record validator."""
import json

MODULE = "Azure AI Foundry"
REQUIRED = ("candidate", "dataset", "threshold", "rollback_target")


def validate_plan(plan):
    missing = [field for field in REQUIRED if not plan.get(field)]
    return {"module": MODULE, "valid": not missing, "missing": missing}


if __name__ == "__main__":
    print(json.dumps(validate_plan({field: field for field in REQUIRED}), indent=2))
