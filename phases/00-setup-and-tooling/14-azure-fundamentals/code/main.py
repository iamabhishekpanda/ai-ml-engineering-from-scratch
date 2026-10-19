"""Offline architecture-plan validator for Azure AI Engineering Fundamentals."""
import json

MODULE = "Azure AI Engineering Fundamentals"
REQUIRED = ("workload", "data_class", "deployment", "rollback_signal")


def validate_plan(plan):
    missing = [field for field in REQUIRED if not plan.get(field)]
    return {"module": MODULE, "valid": not missing, "missing": missing}


if __name__ == "__main__":
    print(json.dumps(validate_plan({field: field for field in REQUIRED}), indent=2))
