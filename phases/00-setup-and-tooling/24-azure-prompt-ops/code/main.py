"""Offline prompt-release validator."""
import json

MODULE = "Azure Prompt Operations"
REQUIRED = ("prompt_version", "dataset", "threshold", "rollback_version")


def validate_plan(plan):
    missing = [field for field in REQUIRED if not plan.get(field)]
    return {"module": MODULE, "valid": not missing, "missing": missing}


if __name__ == "__main__":
    print(json.dumps(validate_plan({field: field for field in REQUIRED}), indent=2))
