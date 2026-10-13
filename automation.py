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

