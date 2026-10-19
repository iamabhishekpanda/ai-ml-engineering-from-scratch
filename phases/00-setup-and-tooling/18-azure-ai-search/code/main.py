"""Offline Azure AI Search index-contract validator."""
import json

MODULE = "Azure AI Search"
REQUIRED = ("source_id", "content_field", "embedding_field", "access_filter")


def validate_plan(plan):
    missing = [field for field in REQUIRED if not plan.get(field)]
    return {"module": MODULE, "valid": not missing, "missing": missing}


if __name__ == "__main__":
    print(json.dumps(validate_plan({field: field for field in REQUIRED}), indent=2))
