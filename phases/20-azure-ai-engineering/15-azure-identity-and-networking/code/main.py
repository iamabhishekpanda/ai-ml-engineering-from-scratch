"""Offline identity and network-plan validator."""
import json

MODULE = "Azure Identity and Networking"
REQUIRED = ("workload_identity", "network_boundary", "access_owner", "audit_signal")


def validate_plan(plan):
    missing = [field for field in REQUIRED if not plan.get(field)]
    return {"module": MODULE, "valid": not missing, "missing": missing}


if __name__ == "__main__":
    print(json.dumps(validate_plan({field: field for field in REQUIRED}), indent=2))
