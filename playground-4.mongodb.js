/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// ============================================================
// PROJECT 1 — ORDER & SHIPPING SUPPORT AUTOMATION
// Complete MongoDB Testing Dataset
// ============================================================

use("order_shipping_automation");

// ------------------------------------------------------------
// RESET EXISTING TEST DATA
// ------------------------------------------------------------

db.customers.deleteMany({});
db.orders.deleteMany({});
db.tracking_events.deleteMany({});
db.cancellation_requests.deleteMany({});
db.address_change_requests.deleteMany({});
db.support_tickets.deleteMany({});
db.test_cases.deleteMany({});

// ============================================================
// 1. CUSTOMERS
// ============================================================

db.customers.insertMany([
  {
    customer_id: "C1001",
    name: "Ali Khan",
    email: "ali.khan@example.com",
    phone: "+923001111111",
    address: {
      street: "12 Main Street",
      city: "Islamabad",
      country: "Pakistan"
    },
    status: "active",
    created_at: ISODate("2026-08-01T09:00:00Z")
  },
  {
    customer_id: "C1002",
    name: "Sara Ahmed",
    email: "sara.ahmed@example.com",
    phone: "+923002222222",
    address: {
      street: "45 College Road",
      city: "Lahore",
      country: "Pakistan"
    },
    status: "active",
    created_at: ISODate("2026-08-03T10:00:00Z")
  },
  {
    customer_id: "C1003",
    name: "Hamza Malik",
    email: "hamza.malik@example.com",
    phone: "+923003333333",
    address: {
      street: "78 University Road",
      city: "Peshawar",
      country: "Pakistan"
    },
    status: "active",
    created_at: ISODate("2026-08-05T11:00:00Z")
  },
  {
    customer_id: "C1004",
    name: "Ayesha Noor",
    email: "ayesha.noor@example.com",
    phone: "+923004444444",
    address: {
      street: "21 Garden Avenue",
      city: "Rawalpindi",
      country: "Pakistan"
    },
    status: "active",
    created_at: ISODate("2026-08-07T12:00:00Z")
  },
  {
    customer_id: "C1005",
    name: "Usman Raza",
    email: "usman.raza@example.com",
    phone: "+923005555555",
    address: {
      street: "90 Canal Road",
      city: "Faisalabad",
      country: "Pakistan"
    },
    status: "active",
    created_at: ISODate("2026-08-09T13:00:00Z")
  },
  {
    customer_id: "C1006",
    name: "Fatima Shah",
    email: "fatima.shah@example.com",
    phone: "+923006666666",
    address: {
      street: "15 Mall Road",
      city: "Karachi",
      country: "Pakistan"
    },
    status: "active",
    created_at: ISODate("2026-08-11T14:00:00Z")
  },
  {
    customer_id: "C1007",
    name: "Bilal Hassan",
    email: "bilal.hassan@example.com",
    phone: "+923007777777",
    address: {
      street: "33 Market Road",
      city: "Multan",
      country: "Pakistan"
    },
    status: "active",
    created_at: ISODate("2026-08-13T15:00:00Z")
  },
  {
    customer_id: "C1008",
    name: "Mariam Iqbal",
    email: "mariam.iqbal@example.com",
    phone: "+923008888888",
    address: {
      street: "55 University Avenue",
      city: "Quetta",
      country: "Pakistan"
    },
    status: "active",
    created_at: ISODate("2026-08-15T16:00:00Z")
  }
]);

// ============================================================
// 2. ORDERS
// ============================================================

db.orders.insertMany([
  {
    order_id: "O10001",
    customer_id: "C1001",
    order_date: ISODate("2026-09-20T10:00:00Z"),
    status: "shipped",
    carrier: "DHL",
    tracking_number: "DHL10000001",
    shipping_address: {
      street: "12 Main Street",
      city: "Islamabad",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-10-08T00:00:00Z"),
    actual_delivery: null,
    cancellation_requested: false,
    address_change_requested: false
  },
  {
    order_id: "O10002",
    customer_id: "C1001",
    order_date: ISODate("2026-09-23T11:30:00Z"),
    status: "in_transit",
    carrier: "FedEx",
    tracking_number: "FDX10000002",
    shipping_address: {
      street: "12 Main Street",
      city: "Islamabad",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-10-09T00:00:00Z"),
    actual_delivery: null,
    cancellation_requested: false,
    address_change_requested: false
  },
  {
    order_id: "O10003",
    customer_id: "C1002",
    order_date: ISODate("2026-09-15T09:00:00Z"),
    status: "delayed",
    carrier: "TCS",
    tracking_number: "TCS10000003",
    shipping_address: {
      street: "45 College Road",
      city: "Lahore",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-09-24T00:00:00Z"),
    actual_delivery: null,
    cancellation_requested: false,
    address_change_requested: false
  },
  {
    order_id: "O10004",
    customer_id: "C1003",
    order_date: ISODate("2026-09-18T14:00:00Z"),
    status: "delivered",
    carrier: "Leopards",
    tracking_number: "LEO10000004",
    shipping_address: {
      street: "78 University Road",
      city: "Peshawar",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-09-25T00:00:00Z"),
    actual_delivery: ISODate("2026-09-25T15:30:00Z"),
    cancellation_requested: false,
    address_change_requested: false
  },
  {
    order_id: "O10005",
    customer_id: "C1004",
    order_date: ISODate("2026-10-01T08:45:00Z"),
    status: "processing",
    carrier: null,
    tracking_number: null,
    shipping_address: {
      street: "21 Garden Avenue",
      city: "Rawalpindi",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-10-10T00:00:00Z"),
    actual_delivery: null,
    cancellation_requested: false,
    address_change_requested: false
  },
  {
    order_id: "O10006",
    customer_id: "C1005",
    order_date: ISODate("2026-10-01T13:20:00Z"),
    status: "processing",
    carrier: null,
    tracking_number: null,
    shipping_address: {
      street: "90 Canal Road",
      city: "Faisalabad",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-10-11T00:00:00Z"),
    actual_delivery: null,
    cancellation_requested: false,
    address_change_requested: false
  },
  {
    order_id: "O10007",
    customer_id: "C1002",
    order_date: ISODate("2026-09-26T16:10:00Z"),
    status: "shipped",
    carrier: "DHL",
    tracking_number: "DHL10000007",
    shipping_address: {
      street: "45 College Road",
      city: "Lahore",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-10-09T00:00:00Z"),
    actual_delivery: null,
    cancellation_requested: false,
    address_change_requested: false
  },
  {
    order_id: "O10008",
    customer_id: "C1006",
    order_date: ISODate("2026-09-22T12:15:00Z"),
    status: "in_transit",
    carrier: "FedEx",
    tracking_number: "FDX10000008",
    shipping_address: {
      street: "15 Mall Road",
      city: "Karachi",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-10-08T00:00:00Z"),
    actual_delivery: null,
    cancellation_requested: false,
    address_change_requested: false
  },
  {
    order_id: "O10009",
    customer_id: "C1007",
    order_date: ISODate("2026-09-20T10:45:00Z"),
    status: "delivered",
    carrier: "TCS",
    tracking_number: "TCS10000009",
    shipping_address: {
      street: "33 Market Road",
      city: "Multan",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-09-28T00:00:00Z"),
    actual_delivery: ISODate("2026-09-28T13:10:00Z"),
    cancellation_requested: false,
    address_change_requested: false
  },
  {
    order_id: "O10010",
    customer_id: "C1008",
    order_date: ISODate("2026-10-02T09:30:00Z"),
    status: "processing",
    carrier: null,
    tracking_number: null,
    shipping_address: {
      street: "55 University Avenue",
      city: "Quetta",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-10-12T00:00:00Z"),
    actual_delivery: null,
    cancellation_requested: false,
    address_change_requested: false
  },
  {
    order_id: "O10011",
    customer_id: "C1003",
    order_date: ISODate("2026-09-29T10:20:00Z"),
    status: "shipped",
    carrier: "Leopards",
    tracking_number: "LEO10000011",
    shipping_address: {
      street: "78 University Road",
      city: "Peshawar",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-10-07T00:00:00Z"),
    actual_delivery: null,
    cancellation_requested: false,
    address_change_requested: false
  },
  {
    order_id: "O10012",
    customer_id: "C1006",
    order_date: ISODate("2026-09-10T15:00:00Z"),
    status: "delayed",
    carrier: "FedEx",
    tracking_number: "FDX10000012",
    shipping_address: {
      street: "15 Mall Road",
      city: "Karachi",
      country: "Pakistan"
    },
    estimated_delivery: ISODate("2026-09-20T00:00:00Z"),
    actual_delivery: null,
    cancellation_requested: false,
    address_change_requested: false
  }
]);

// ============================================================
// 3. MOCK CARRIER TRACKING DATA
// ============================================================

db.tracking_events.insertMany([
  {
    tracking_number: "DHL10000001",
    carrier: "DHL",
    current_status: "in_transit",
    location: "Islamabad Sorting Center",
    event_time: ISODate("2026-10-06T08:30:00Z"),
    estimated_delivery: ISODate("2026-10-08T00:00:00Z"),
    events: [
      {
        status: "label_created",
        location: "Islamabad",
        event_time: ISODate("2026-09-20T11:00:00Z")
      },
      {
        status: "picked_up",
        location: "Islamabad",
        event_time: ISODate("2026-09-21T09:00:00Z")
      },
      {
        status: "in_transit",
        location: "Islamabad Sorting Center",
        event_time: ISODate("2026-10-06T08:30:00Z")
      }
    ]
  },
  {
    tracking_number: "FDX10000002",
    carrier: "FedEx",
    current_status: "in_transit",
    location: "Lahore Distribution Center",
    event_time: ISODate("2026-10-06T07:00:00Z"),
    estimated_delivery: ISODate("2026-10-09T00:00:00Z"),
    events: [
      {
        status: "picked_up",
        location: "Islamabad",
        event_time: ISODate("2026-09-24T10:00:00Z")
      },
      {
        status: "in_transit",
        location: "Lahore Distribution Center",
        event_time: ISODate("2026-10-06T07:00:00Z")
      }
    ]
  },
  {
    tracking_number: "TCS10000003",
    carrier: "TCS",
    current_status: "delayed",
    location: "Lahore Hub",
    event_time: ISODate("2026-10-05T06:00:00Z"),
    estimated_delivery: null,
    events: [
      {
        status: "picked_up",
        location: "Lahore",
        event_time: ISODate("2026-09-16T10:00:00Z")
      },
      {
        status: "delayed",
        location: "Lahore Hub",
        event_time: ISODate("2026-10-05T06:00:00Z")
      }
    ]
  },
  {
    tracking_number: "LEO10000004",
    carrier: "Leopards",
    current_status: "delivered",
    location: "Peshawar",
    event_time: ISODate("2026-09-25T15:30:00Z"),
    estimated_delivery: ISODate("2026-09-25T00:00:00Z"),
    events: [
      {
        status: "out_for_delivery",
        location: "Peshawar",
        event_time: ISODate("2026-09-25T09:00:00Z")
      },
      {
        status: "delivered",
        location: "Peshawar",
        event_time: ISODate("2026-09-25T15:30:00Z")
      }
    ]
  },
  {
    tracking_number: "DHL10000007",
    carrier: "DHL",
    current_status: "in_transit",
    location: "Lahore",
    event_time: ISODate("2026-10-06T09:30:00Z"),
    estimated_delivery: ISODate("2026-10-09T00:00:00Z"),
    events: [
      {
        status: "picked_up",
        location: "Lahore",
        event_time: ISODate("2026-09-27T09:00:00Z")
      },
      {
        status: "in_transit",
        location: "Lahore",
        event_time: ISODate("2026-10-06T09:30:00Z")
      }
    ]
  },
  {
    tracking_number: "FDX10000008",
    carrier: "FedEx",
    current_status: "out_for_delivery",
    location: "Karachi",
    event_time: ISODate("2026-10-07T06:30:00Z"),
    estimated_delivery: ISODate("2026-10-08T00:00:00Z"),
    events: [
      {
        status: "picked_up",
        location: "Karachi",
        event_time: ISODate("2026-09-23T10:00:00Z")
      },
      {
        status: "out_for_delivery",
        location: "Karachi",
        event_time: ISODate("2026-10-07T06:30:00Z")
      }
    ]
  },
  {
    tracking_number: "TCS10000009",
    carrier: "TCS",
    current_status: "delivered",
    location: "Multan",
    event_time: ISODate("2026-09-28T13:10:00Z"),
    estimated_delivery: ISODate("2026-09-28T00:00:00Z"),
    events: [
      {
        status: "out_for_delivery",
        location: "Multan",
        event_time: ISODate("2026-09-28T08:00:00Z")
      },
      {
        status: "delivered",
        location: "Multan",
        event_time: ISODate("2026-09-28T13:10:00Z")
      }
    ]
  },
  {
    tracking_number: "LEO10000011",
    carrier: "Leopards",
    current_status: "delivered",
    location: "Peshawar",
    event_time: ISODate("2026-10-07T12:00:00Z"),
    estimated_delivery: ISODate("2026-10-07T00:00:00Z"),
    events: [
      {
        status: "out_for_delivery",
        location: "Peshawar",
        event_time: ISODate("2026-10-07T08:00:00Z")
      },
      {
        status: "delivered",
        location: "Peshawar",
        event_time: ISODate("2026-10-07T12:00:00Z")
      }
    ]
  },
  {
    tracking_number: "FDX10000012",
    carrier: "FedEx",
    current_status: "delayed",
    location: "Karachi Hub",
    event_time: ISODate("2026-10-06T05:30:00Z"),
    estimated_delivery: null,
    events: [
      {
        status: "picked_up",
        location: "Karachi",
        event_time: ISODate("2026-09-11T10:00:00Z")
      },
      {
        status: "delayed",
        location: "Karachi Hub",
        event_time: ISODate("2026-10-06T05:30:00Z")
      }
    ]
  }
]);

// ============================================================
// 4. CANCELLATION REQUESTS
// ============================================================

db.cancellation_requests.insertMany([
  {
    request_id: "CAN10001",
    customer_id: "C1004",
    order_id: "O10005",
    requested_at: ISODate("2026-10-05T10:00:00Z"),
    reason: "Customer no longer needs the order.",
    status: "pending",
    eligible: true,
    processed_at: null
  },
  {
    request_id: "CAN10002",
    customer_id: "C1001",
    order_id: "O10001",
    requested_at: ISODate("2026-10-06T11:00:00Z"),
    reason: "Customer wants to cancel a shipped order.",
    status: "pending",
    eligible: false,
    processed_at: null
  },
  {
    request_id: "CAN10003",
    customer_id: "C1002",
    order_id: "O10003",
    requested_at: ISODate("2026-10-06T12:00:00Z"),
    reason: "Order is delayed.",
    status: "pending",
    eligible: false,
    processed_at: null
  }
]);

// ============================================================
// 5. ADDRESS CHANGE REQUESTS
// ============================================================

db.address_change_requests.insertMany([
  {
    request_id: "ADR10001",
    customer_id: "C1005",
    order_id: "O10006",
    requested_at: ISODate("2026-10-05T09:00:00Z"),
    current_address: {
      street: "90 Canal Road",
      city: "Faisalabad",
      country: "Pakistan"
    },
    new_address: {
      street: "14 New Market Road",
      city: "Faisalabad",
      country: "Pakistan"
    },
    status: "pending",
    eligible: true,
    processed_at: null
  },
  {
    request_id: "ADR10002",
    customer_id: "C1001",
    order_id: "O10001",
    requested_at: ISODate("2026-10-06T13:00:00Z"),
    current_address: {
      street: "12 Main Street",
      city: "Islamabad",
      country: "Pakistan"
    },
    new_address: {
      street: "22 New Street",
      city: "Islamabad",
      country: "Pakistan"
    },
    status: "pending",
    eligible: false
  }
]);

// ============================================================
// 6. SUPPORT TICKETS
// ============================================================

db.support_tickets.insertMany([
  {
    ticket_id: "T10001",
    customer_id: "C1001",
    message: "Where is my order O10001?",
    intent: "tracking",
    order_id: "O10001",
    priority: "normal",
    status: "open"
  },
  {
    ticket_id: "T10002",
    customer_id: "C1002",
    message: "My order O10003 is delayed. Can you tell me what happened?",
    intent: "delayed_order",
    order_id: "O10003",
    priority: "high",
    status: "open"
  },
  {
    ticket_id: "T10003",
    customer_id: "C1003",
    message: "The system says O10004 was delivered but I did not receive it.",
    intent: "delivered_not_received",
    order_id: "O10004",
    priority: "high",
    status: "open"
  },
  {
    ticket_id: "T10004",
    customer_id: "C1004",
    message: "Please cancel order O10005.",
    intent: "cancellation",
    order_id: "O10005",
    priority: "normal",
    status: "open"
  },
  {
    ticket_id: "T10005",
    customer_id: "C1005",
    message: "I need to change the delivery address for O10006.",
    intent: "address_change",
    order_id: "O10006",
    priority: "normal",
    status: "open"
  },
  {
    ticket_id: "T10006",
    customer_id: "C1001",
    message: "Can you check order O10007 for me?",
    intent: "tracking",
    order_id: "O10007",
    priority: "high",
    status: "open",
    expected_result: "reject_ownership"
  },
  {
    ticket_id: "T10007",
    customer_id: "C9999",
    message: "Where is order O10001?",
    intent: "tracking",
    order_id: "O10001",
    priority: "high",
    status: "open",
    expected_result: "reject_invalid_customer"
  },
  {
    ticket_id: "T10008",
    customer_id: "C1001",
    message: "Where is order O99999?",
    intent: "tracking",
    order_id: "O99999",
    priority: "high",
    status: "open",
    expected_result: "reject_invalid_order"
  }
]);

// ============================================================
// 7. AUTOMATED TEST CASES
// ============================================================

db.test_cases.insertMany([
  {
    test_id: "TC001",
    workflow: "tracking",
    description: "Valid customer and valid owned order",
    customer_id: "C1001",
    order_id: "O10001",
    expected_result: "success",
    expected_action: "retrieve_tracking_information"
  },
  {
    test_id: "TC002",
    workflow: "tracking",
    description: "Invalid customer ID",
    customer_id: "C9999",
    order_id: "O10001",
    expected_result: "reject",
    expected_reason: "customer_not_found"
  },
  {
    test_id: "TC003",
    workflow: "tracking",
    description: "Invalid order ID",
    customer_id: "C1001",
    order_id: "O99999",
    expected_result: "reject",
    expected_reason: "order_not_found"
  },
  {
    test_id: "TC004",
    workflow: "tracking",
    description: "Order exists but belongs to another customer",
    customer_id: "C1001",
    order_id: "O10007",
    expected_result: "reject",
    expected_reason: "order_not_owned_by_customer"
  },
  {
    test_id: "TC005",
    workflow: "tracking",
    description: "Valid second order belonging to same customer",
    customer_id: "C1001",
    order_id: "O10002",
    expected_result: "success",
    expected_action: "retrieve_tracking_information"
  },
  {
    test_id: "TC006",
    workflow: "delayed_order",
    description: "Delayed order",
    customer_id: "C1002",
    order_id: "O10003",
    expected_result: "delayed",
    expected_action: "retrieve_tracking_and_explain_delay"
  },
  {
    test_id: "TC007",
    workflow: "delivered_not_received",
    description: "Carrier says delivered but customer reports missing order",
    customer_id: "C1003",
    order_id: "O10004",
    expected_result: "escalate",
    expected_reason: "delivered_but_not_received"
  },
  {
    test_id: "TC008",
    workflow: "cancellation",
    description: "Cancellation requested while order is still processing",
    customer_id: "C1004",
    order_id: "O10005",
    expected_result: "eligible",
    expected_action: "process_cancellation"
  },
  {
    test_id: "TC009",
    workflow: "cancellation",
    description: "Cancellation requested after order was shipped",
    customer_id: "C1001",
    order_id: "O10001",
    expected_result: "not_eligible",
    expected_reason: "order_already_shipped"
  },
  {
    test_id: "TC010",
    workflow: "address_change",
    description: "Address change requested while order is processing",
    customer_id: "C1005",
    order_id: "O10006",
    expected_result: "eligible",
    expected_action: "update_shipping_address"
  },
  {
    test_id: "TC011",
    workflow: "address_change",
    description: "Address change requested after shipment",
    customer_id: "C1001",
    order_id: "O10001",
    expected_result: "not_eligible",
    expected_reason: "order_already_shipped"
  },
  {
    test_id: "TC012",
    workflow: "security",
    description: "Customer attempts to access another customer's order",
    customer_id: "C1001",
    order_id: "O10007",
    expected_result: "reject",
    expected_reason: "ownership_mismatch"
  },
  {
    test_id: "TC013",
    workflow: "security",
    description: "Unknown customer attempts to access a valid order",
    customer_id: "C9999",
    order_id: "O10001",
    expected_result: "reject",
    expected_reason: "customer_not_found"
  },
  {
    test_id: "TC014",
    workflow: "security",
    description: "Valid customer supplies nonexistent order",
    customer_id: "C1001",
    order_id: "O99999",
    expected_result: "reject",
    expected_reason: "order_not_found"
  },
  {
    test_id: "TC015",
    workflow: "tracking",
    description: "Order is delivered normally",
    customer_id: "C1007",
    order_id: "O10009",
    expected_result: "success",
    expected_action: "return_delivered_status"
  },
  {
    test_id: "TC016",
    workflow: "tracking",
    description: "Order is currently out for delivery",
    customer_id: "C1006",
    order_id: "O10008",
    expected_result: "success",
    expected_action: "return_out_for_delivery_status"
  },
  {
    test_id: "TC017",
    workflow: "tracking",
    description: "Order has delayed carrier status",
    customer_id: "C1006",
    order_id: "O10012",
    expected_result: "delayed",
    expected_action: "return_delay_information"
  },
  {
    test_id: "TC018",
    workflow: "tracking",
    description: "Tracking request for shipped order",
    customer_id: "C1003",
    order_id: "O10011",
    expected_result: "success",
    expected_action: "retrieve_tracking_information"
  }
]);

// ============================================================
// 8. INDEXES
// ============================================================

db.customers.createIndex(
  { customer_id: 1 },
  { unique: true }
);

db.customers.createIndex(
  { email: 1 },
  { unique: true }
);

db.orders.createIndex(
  { order_id: 1 },
  { unique: true }
);

db.orders.createIndex(
  { customer_id: 1, order_id: 1 }
);

db.orders.createIndex(
  { status: 1 }
);

db.orders.createIndex(
  { tracking_number: 1 }
);

db.tracking_events.createIndex(
  { tracking_number: 1 },
  { unique: true }
);

db.cancellation_requests.createIndex(
  { request_id: 1 },
  { unique: true }
);

db.cancellation_requests.createIndex(
  { customer_id: 1, order_id: 1 }
);

db.address_change_requests.createIndex(
  { request_id: 1 },
  { unique: true }
);

db.address_change_requests.createIndex(
  { customer_id: 1, order_id: 1 }
);

db.support_tickets.createIndex(
  { ticket_id: 1 },
  { unique: true }
);

db.support_tickets.createIndex(
  { customer_id: 1 }
);

db.test_cases.createIndex(
  { test_id: 1 },
  { unique: true }
);

// ============================================================
// 9. FINAL SUMMARY
// ============================================================

print("");
print("============================================================");
print("ORDER & SHIPPING AUTOMATION TEST DATA LOADED");
print("============================================================");
print("Customers:              " + db.customers.countDocuments());
print("Orders:                 " + db.orders.countDocuments());
print("Tracking records:       " + db.tracking_events.countDocuments());
print("Cancellation requests:  " + db.cancellation_requests.countDocuments());
print("Address requests:       " + db.address_change_requests.countDocuments());
print("Support tickets:        " + db.support_tickets.countDocuments());
print("Test cases:             " + db.test_cases.countDocuments());
print("============================================================");
print("Database: order_shipping_automation");
print("============================================================");