import json
from pathlib import Path
from datetime import datetime, timezone

REVIEW_FILE = Path(__file__).with_name("human_review_requests.json")


def create_review_request(customer_id, order_id, request_type, details):
    """Store a support request that requires human review."""

    request = {
        "customer_id": customer_id,
        "order_id": order_id,
        "request_type": request_type,
        "details": details,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    if REVIEW_FILE.exists():
        with REVIEW_FILE.open("r", encoding="utf-8") as file:
            requests = json.load(file)
    else:
        requests = []

    requests.append(request)

    with REVIEW_FILE.open("w", encoding="utf-8") as file:
        json.dump(requests, file, indent=4)

    return request