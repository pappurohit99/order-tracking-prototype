const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('orders.db');

// First create the table
db.serialize(() => {
    // Drop existing table
    db.run('DROP TABLE IF EXISTS orders');
    
    // Create fresh table
    db.run(`CREATE TABLE orders (
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
        estimated_delivery DATETIME,
        notification_preferences TEXT
    )`);
    
    // Now seed the data
    const orders = [
        {
            order_number: 'ORD123',
            customer_name: 'John Doe',
            delivery_address: '123 Main St, City',
            status: 'In Transit',
            estimated_delivery: '2024-02-25',
            created_at: '2024-02-20T10:00:00Z',
            current_location: JSON.stringify({ lat: 51.515, lng: -0.09 }),
            location_history: JSON.stringify([
                {
                    status: 'Order Placed',
                    timestamp: '2024-02-20T10:00:00Z',
                    location: 'Warehouse A',
                    coordinates: { lat: 51.505, lng: -0.09 }
                },
                {
                    status: 'Picked Up',
                    timestamp: '2024-02-21T09:00:00Z',
                    location: 'Distribution Center',
                    coordinates: { lat: 51.515, lng: -0.09 }
                }
            ]),
            notification_preferences: JSON.stringify({
                sms: true,
                email: false,
                voice_assistant: false
            })
        },
        {
            order_number: 'ORD124',
            customer_name: 'Jane Smith',
            delivery_address: '456 Oak Ave, Town',
            status: 'Delivered',
            estimated_delivery: '2024-02-19',
            created_at: '2024-02-18T09:00:00Z',
            current_location: JSON.stringify({ lat: 51.52, lng: -0.11 }),
            location_history: JSON.stringify([
                {
                    status: 'Order Placed',
                    timestamp: '2024-02-18T09:00:00Z',
                    location: 'Warehouse B',
                    coordinates: { lat: 51.51, lng: -0.1 }
                },
                {
                    status: 'In Transit',
                    timestamp: '2024-02-18T14:00:00Z',
                    location: 'City Hub',
                    coordinates: { lat: 51.515, lng: -0.105 }
                },
                {
                    status: 'Delivered',
                    timestamp: '2024-02-19T14:00:00Z',
                    location: 'Customer Address',
                    coordinates: { lat: 51.52, lng: -0.11 }
                }
            ]),
            notification_preferences: JSON.stringify({
                sms: true,
                email: true,
                voice_assistant: true
            })
        }
    ];

    orders.forEach(order => {
        db.run(`INSERT INTO orders (
            order_number, 
            customer_name, 
            delivery_address, 
            status, 
            estimated_delivery, 
            created_at,
            current_location,
            location_history,
            notification_preferences
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            order.order_number,
            order.customer_name,
            order.delivery_address,
            order.status,
            order.estimated_delivery,
            order.created_at,
            order.current_location,
            order.location_history,
            order.notification_preferences
        ]);
    });
});

db.close();