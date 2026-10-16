from review_queue import (
    create_review_request,
    get_review_requests,
    update_review_status
)

# 1. Create a test request
request = create_review_request(
    customer_id="CUST_TEST",
    order_id="ORD_TEST",
    request_type="cancellation",
    details="Test cancellation request."
)

print("\n1. Created request:")
print(request)

# 2. Retrieve all requests
all_requests = get_review_requests()
print("\n2. Total requests:", len(all_requests))

# 3. Retrieve pending requests
pending_requests = get_review_requests(status="pending")
print("\n3. Pending requests:", len(pending_requests))

# 4. Update the test request
request_id = request.get("request_id")

if request_id:
    updated_request = update_review_status(
        request_id,
        "approved"
    )

    print("\n4. Updated request:")
    print(updated_request)

    # 5. Verify the update
    verified_requests = get_review_requests(status="approved")

    if any(item.get("request_id") == request_id
           for item in verified_requests):
        print("\nPASS: Review status updated successfully.")
    else:
        print("\nFAIL: Updated request was not found.")
else:
    print("\nFAIL: Request has no request_id.")