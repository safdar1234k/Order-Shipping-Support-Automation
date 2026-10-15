from review_queue import create_review_request

request = create_review_request(
    customer_id="C1001",
    order_id="O10003",
    request_type="delayed_order",
    details="Order is past its expected delivery date."
)

print(request)