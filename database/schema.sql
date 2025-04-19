CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE,
    customer_name TEXT,
    delivery_address TEXT,
    status TEXT,
    created_at DATETIME,
    estimated_delivery DATETIME,
    current_location TEXT,
    total_amount DECIMAL(10,2),
    items TEXT
);