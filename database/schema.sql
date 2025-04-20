CREATE TABLE IF NOT EXISTS orders (
    order_number TEXT PRIMARY KEY,
    customer_name TEXT,
    delivery_address TEXT,
    status TEXT,
    estimated_delivery TEXT,
    created_at TEXT,
    current_location TEXT DEFAULT '{"lat": 51.505, "lng": -0.09}',
    location_history TEXT,
    notification_preferences TEXT DEFAULT '{"sms":false,"email":false,"voice_assistant":false}');