import json
from pathlib import Path
from datetime import datetime, timezone
from uuid import uuid4

REVIEW_FILE = Path(__file__).with_name("human_review_requests.json")


def create_review_request(customer_id, order_id, request_type, details):
    """Store a support request that requires human review."""

    request = {
        "request_id": str(uuid4()),
        "customer_id": customer_id,
        "order_id": order_id,
        "request_type": request_type,
        "details": details,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    if REVIEW_FILE.exists():
        try:
            with REVIEW_FILE.open("r", encoding="utf-8") as file:
                requests = json.load(file)

            if not isinstance(requests, list):
                raise ValueError("Review queue must contain a JSON list.")

        except (json.JSONDecodeError, ValueError) as error:
            raise RuntimeError(
                "Review queue data is invalid. Existing data was not overwritten."
            ) from error
    else:
        requests = []

    requests.append(request)

    with REVIEW_FILE.open("w", encoding="utf-8") as file:
        json.dump(requests, file, indent=4)

    return request

def get_review_requests(status=None):
    """Retrieve review requests, optionally filtered by status."""

    if not REVIEW_FILE.exists():
        return []

    try:
        with REVIEW_FILE.open("r", encoding="utf-8") as file:
            requests = json.load(file)

        if not isinstance(requests, list):
            raise ValueError("Review queue must contain a JSON list.")

    except (json.JSONDecodeError, ValueError) as error:
        raise RuntimeError(
            "Review queue data is invalid. No changes were made."
        ) from error

    if status is not None:
        requests = [
            request for request in requests
            if request.get("status") == status
        ]

    return requests


def update_review_status(request_id, new_status):
    """Update the status of an existing review request."""

    allowed_statuses = {"pending", "approved", "rejected", "resolved"}

    if new_status not in allowed_statuses:
        raise ValueError("Invalid review status.")

    requests = get_review_requests()

    for request in requests:
        if request.get("request_id") == request_id:
            request["status"] = new_status
            request["updated_at"] = datetime.now(
                timezone.utc
            ).isoformat()

            with REVIEW_FILE.open("w", encoding="utf-8") as file:
                json.dump(requests, file, indent=4)

            return request

    return None