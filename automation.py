from datetime import datetime, date
from database import db
from review_queue import create_review_request

order_collection = db['orders']

def get_order(order_id):
    "Retrieve an order by its ID from the database."
    order = order_collection.find_one({"order_id": order_id})
    return order

# Validate order ownership
def validate_order_ownership(order, customer_id):
    "Validate that the order ownership who request about order details."
    if order is None:
        return False
    if order.get("customer_id") == customer_id:
        return True
    return False
#test validate_order_ownership
# order =  get_order("O10003")
# is_valid = validate_order_ownership(order, "C1001" )
# print(is_valid)

customers_collection = db['customers']
def get_customer(customer_id):
    "Retrieve a customer by its ID from the database."
    customer = customers_collection.find_one({'customer_id': customer_id})
    return customer

#test get_customer

#customer = get_customer('C1002')
#print(customer)

def validate_customer(customer_id):
    customer = get_customer(customer_id)
    if customer is None:
        return False
    return True

#print(validate_customer('C1002'))

def validate_customer_record(customer):
    return customer is not None

#validat support request
def validate_support_request(customer_id, order_id):
    """Validate a support request and retrieve its customer and order."""

    customer = get_customer(customer_id)

    if not validate_customer_record(customer):
        return {
            "success": False,
            "message": "Customer not found.",
            "customer": None,
            "order": None
        }

    order = get_order(order_id)

    if order is None:
        return {
            "success": False,
            "message": "Order not found.",
            "customer": None,
            "order": None
        }

    if not validate_order_ownership(order, customer_id):
        return {
            "success": False,
            "message": "Order does not belong to this customer.",
            "customer": None,
            "order": None
        }

    return {
        "success": True,
        "message": "Support request validated successfully.",
        "customer": customer,
        "order": order
    }
#tracking_events_collection = db["tracking events"]
#print(tracking_events_collection.find_one({"tracking_number": "TCS10000009"}))

#If the order is missing, return a clear failure result.
#If the order is still processing or has no tracking number, report that tracking information is not yet available.
#Otherwise, retrieve the relevant tracking event from MongoDB using the actual field names in your collection.
#If no tracking event exists, report that tracking information was not found. Do not invent a status.

tracking_events_collection = db['tracking events']


def get_tracking_status(order):
    """Retrieve tracking status for a validated order."""

    if order is None:
        return {
            "success": False,
            "message": "Order not found.",
            "tracking_status": None
        }

    if order.get("status", "").lower() in ["processing", "pending"]:
        return {
            "success": False,
            "message": "Tracking information is not yet available.",
            "tracking_status": None
        }

    tracking_number = order.get("tracking_number")

    if not tracking_number:
        return {
            "success": False,
            "message": "Tracking information is not yet available.",
            "tracking_status": None
        }

    tracking_event = tracking_events_collection.find_one(
        {"tracking_number": tracking_number}
    )

    if tracking_event is None:
        return {
            "success": False,
            "message": "Tracking information was not found.",
            "tracking_status": None
        }

    return {
        "success": True,
        "message": "Tracking information retrieved successfully.",
        "tracking_status": tracking_event.get("status"),
        "tracking_number": tracking_number
    }

#process_tracking_request()
#This function will coordinate the existing components:
#1. Validate the customer and order using validate_support_request().
#2. If validation fails, return the failure result without querying tracking data.
#####3. If validation succeeds, call get_tracking_status() with the validated order.
#4. Return a consistent result containing the validation outcome and tracking information.#

def process_tracking_request(customer_id, order_id):
    """Process a tracking request for a given customer and order."""

    # Step 1: Validate the customer and order
    validation_result = validate_support_request(customer_id, order_id)

    # Step 2: If validation fails, return the failure result
    if not validation_result["success"]:
        return {
            "success": False,
            "message": validation_result["message"],
            "tracking_status": None,
            "tracking_number": None
        }

    # Step 3: If validation succeeds, call get_tracking_status() with the validated order
    order = validation_result["order"]
    tracking_result = get_tracking_status(order)

    # Step 4: Return a consistent result containing the validation outcome and tracking information
    return {
        "success": tracking_result["success"],
        "message": tracking_result["message"],
        "tracking_status": tracking_result.get("tracking_status"),
        "tracking_number": tracking_result.get("tracking_number")
    }

#test = process_tracking_request("C100", "O10003")
#print(test)




def process_delayed(customer_id, order_id):
    """Determine whether a validated order is delayed."""

    validation_result = validate_support_request(customer_id, order_id)

    if not validation_result["success"]:
        return {
            "success": False,
            "message": validation_result["message"],
            "order_status": None,
            "is_delayed": None
        }

    order = validation_result["order"]
    order_status = (order.get("status") or "").lower()

    if order_status == "delivered":
        return {
            "success": True,
            "message": "Order has already been delivered.",
            "order_status": order_status,
            "is_delayed": False
        }

    expected_date = order.get("expected_delivery_date")

    if not expected_date:
        return {
            "success": False,
            "message": "Expected delivery date is unavailable. Manual review is required.",
            "order_status": order_status,
            "is_delayed": None
        }

    try:
        if isinstance(expected_date, datetime):
            expected_date = expected_date.date()
        elif isinstance(expected_date, date):
            pass
        elif isinstance(expected_date, str):
            expected_date = date.fromisoformat(expected_date)
        else:
            raise ValueError("Unsupported date format")

    except (ValueError, TypeError):
        return {
            "success": False,
            "message": "Expected delivery date is invalid. Manual review is required.",
            "order_status": order_status,
            "is_delayed": None
        }

    today = datetime.now().date()
    is_delayed = expected_date < today

    if is_delayed:
        message = "Order is past its expected delivery date. Further investigation may be required."
        if is_delayed:
            review_request = create_review_request(
        customer_id=customer_id,
        order_id=order_id,
        request_type="delayed_order",
        details="Order is past its expected delivery date and requires investigation."
    )
    else:
        message = "Order is not yet past its expected delivery date."

    return {
        "success": True,
        "message": message,
        "order_status": order_status,
        "is_delayed": is_delayed
    }

#test = process_delayed("C1001", "O10002")
#print(test)

#process_cancellation_request(customer_id, order_id).
#It should:
#1. Call validate_support_request(customer_id, order_id).
#2. If validation fails, return the existing failure message without creating a review request.
#3. If the order is already delivered, reject the cancellation request and do not create a review record.
#4. Otherwise, create a review request using create_review_request() with:
 #  - request_type="cancellation"
  # - A clear explanation that the customer has requested cancellation and staff approval is required.
#5. Return a consistent result with success, message, and review_request

def process_cancellation_request(customer_id, order_id):
    """Submit a cancellation request for human review."""

    # Step 1: Validate the customer and order
    validation_result = validate_support_request(customer_id, order_id)

    if not validation_result["success"]:
        return {
            "success": False,
            "message": validation_result["message"],
            "review_request": None
        }

    # Step 2: Retrieve the validated order
    order = validation_result["order"]
    order_status = (order.get("status") or "").lower()

    # Step 3: Reject cancellation for delivered orders
    if order_status == "delivered":
        return {
            "success": False,
            "message": "This order has already been delivered. Cancellation cannot be requested through this workflow.",
            "review_request": None
        }

    # Step 4: Create a human-review request
    review_request = create_review_request(
        customer_id=customer_id,
        order_id=order_id,
        request_type="cancellation",
        details="Customer requested order cancellation. Staff review and approval are required."
    )

    # Step 5: Return the result without claiming cancellation is complete
    return {
        "success": True,
        "message": "Your cancellation request has been submitted and is awaiting staff review. The order has not been cancelled yet.",
        "review_request": review_request
    }

#test = process_cancellation_request("C1001", "O10002")
#print(test)
def process_address_change_request(customer_id, order_id, new_address):
    """Submit an address-change request for human review."""

    validation_result = validate_support_request(customer_id, order_id)

    if not validation_result["success"]:
        return {
            "success": False,
            "message": validation_result["message"],
            "review_request": None
        }

    order = validation_result["order"]
    order_status = (order.get("status") or "").lower()

    if order_status == "delivered":
        return {
            "success": False,
            "message": "The order has already been delivered. An address change cannot be requested through this workflow.",
            "review_request": None
        }

    if not isinstance(new_address, str) or not new_address.strip():
        return {
            "success": False,
            "message": "A valid new address is required.",
            "review_request": None
        }

    review_request = create_review_request(
        customer_id=customer_id,
        order_id=order_id,
        request_type="address_change",
        details=f"Customer requested an address change to: {new_address.strip()}. Staff review and approval are required."
    )

    return {
        "success": True,
        "message": "Your address-change request has been submitted for staff review. The address has not been changed yet.",
        "review_request": review_request
    }


def process_delivery_dispute(customer_id, order_id, details):
    """Escalate a delivered-but-not-received report for human review."""

    validation_result = validate_support_request(customer_id, order_id)

    if not validation_result["success"]:
        return {
            "success": False,
            "message": validation_result["message"],
            "review_request": None
        }

    order = validation_result["order"]
    order_status = (order.get("status") or "").lower()

    if order_status != "delivered":
        return {
            "success": False,
            "message": (
                "This workflow is for orders marked as delivered. "
                "Please use the tracking or delayed-order workflow instead."
            ),
            "review_request": None
        }

    if not isinstance(details, str) or not details.strip():
        return {
            "success": False,
            "message": "Please provide details about the delivery issue.",
            "review_request": None
        }

    review_request = create_review_request(
        customer_id=customer_id,
        order_id=order_id,
        request_type="delivered_not_received",
        details=(
            f"Customer reports that the order was marked delivered "
            f"but was not received. Details: {details.strip()}. "
            "Staff investigation is required."
        )
    )

    return {
        "success": True,
        "message": (
            "Your delivery dispute has been submitted for staff "
            "investigation. No conclusion has been reached yet."
        ),
        "review_request": review_request
    }