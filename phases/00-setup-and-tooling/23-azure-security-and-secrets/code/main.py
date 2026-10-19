"""Offline Azure security-plan validator."""
import json

MODULE = "Azure Security and Secrets"
REQUIRED = ("data_class", "secret_store", "managed_identity", "rotation_owner")


def validate_plan(plan):
    missing = [field for field in REQUIRED if not plan.get(field)]
    return {"module": MODULE, "valid": not missing, "missing": missing}


if __name__ == "__main__":
    print(json.dumps(validate_plan({field: field for field in REQUIRED}), indent=2))
