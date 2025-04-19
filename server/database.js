const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/orders.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE,
        customer_name TEXT,
        delivery_address TEXT,
        status TEXT,
        current_location TEXT,
        location_history TEXT,
        total_amount DECIMAL(10,2),
        items TEXT,
        created_at DATETIME,
        estimated_delivery DATETIME
    )`);
});

module.exports = db;