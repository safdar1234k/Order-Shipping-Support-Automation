from database import db

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

tracking_events_collection = db["tracking events"]


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

