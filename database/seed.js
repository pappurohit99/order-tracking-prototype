const db = require('../server/database');

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
        estimated_delivery DATETIME
    )`);
    
    // Now seed the data
    const orders = [
        {
            order_number: 'ORD-2024-001',
            customer_name: 'John Doe',
            delivery_address: '123 Main St, Boston, MA',
            status: 'In Transit',
            current_location: '42.3601,-71.0589',
            location_history: JSON.stringify([
                { location: '42.3505,-71.0589', timestamp: '2024-03-10 09:00:00', status: 'Picked up from warehouse' },
                { location: '42.3601,-71.0589', timestamp: '2024-03-10 14:30:00', status: 'In local delivery facility' }
            ]),
            total_amount: 249.99,
            items: JSON.stringify(['MacBook Pro', 'Magic Mouse']),
            created_at: '2024-03-10 08:00:00',
            estimated_delivery: '2024-03-12 17:00:00'
        },
        {
            order_number: 'ORD-2024-002',
            customer_name: 'Sarah Wilson',
            delivery_address: '789 Tech Park, San Francisco, CA',
            status: 'In Transit',
            current_location: '37.7749,-122.4194',
            location_history: JSON.stringify([
                { location: '37.7749,-122.4194', timestamp: '2024-03-11 10:00:00', status: 'Order processed' },
                { location: '37.7833,-122.4167', timestamp: '2024-03-11 15:45:00', status: 'Out for delivery' }
            ]),
            total_amount: 899.99,
            items: JSON.stringify(['4K Monitor', 'Wireless Keyboard', 'USB-C Hub']),
            created_at: '2024-03-11 09:00:00',
            estimated_delivery: '2024-03-13 12:00:00'
        },
        {
            order_number: 'ORD-2024-003',
            customer_name: 'Emily Chen',
            delivery_address: '567 Park Ave, New York, NY',
            status: 'Delivered',
            current_location: '40.7128,-74.0060',
            location_history: JSON.stringify([
                { location: '40.7128,-74.0060', timestamp: '2024-03-08 08:30:00', status: 'Order confirmed' },
                { location: '40.7589,-73.9851', timestamp: '2024-03-08 14:00:00', status: 'In transit' },
                { location: '40.7829,-73.9654', timestamp: '2024-03-09 11:00:00', status: 'Out for delivery' },
                { location: '40.7128,-74.0060', timestamp: '2024-03-09 15:30:00', status: 'Delivered' }
            ]),
            total_amount: 129.99,
            items: JSON.stringify(['AirPods Pro', 'Phone Case']),
            created_at: '2024-03-08 08:00:00',
            estimated_delivery: '2024-03-09 17:00:00'
        },
        {
            order_number: 'ORD-2024-004',
            customer_name: 'Michael Brown',
            delivery_address: '321 Lake View, Chicago, IL',
            status: 'Delivered',
            current_location: '41.8781,-87.6298',
            location_history: JSON.stringify([
                { location: '41.8781,-87.6298', timestamp: '2024-03-05 09:15:00', status: 'Processing' },
                { location: '41.8819,-87.6278', timestamp: '2024-03-05 14:30:00', status: 'Shipped' },
                { location: '41.8961,-87.6543', timestamp: '2024-03-06 10:00:00', status: 'In local facility' },
                { location: '41.8781,-87.6298', timestamp: '2024-03-06 16:45:00', status: 'Delivered' }
            ]),
            total_amount: 549.99,
            items: JSON.stringify(['Gaming Console', 'Extra Controller', 'Games Bundle']),
            created_at: '2024-03-05 09:00:00',
            estimated_delivery: '2024-03-06 17:00:00'
        },
        {
            order_number: 'ORD-2024-005',
            customer_name: 'David Martinez',
            delivery_address: '456 Ocean Drive, Miami, FL',
            status: 'Delivered',
            current_location: '25.7617,-80.1918',
            location_history: JSON.stringify([
                { location: '25.7617,-80.1918', timestamp: '2024-03-07 10:30:00', status: 'Order received' },
                { location: '25.7989,-80.2042', timestamp: '2024-03-07 15:00:00', status: 'In transit' },
                { location: '25.8102,-80.1976', timestamp: '2024-03-08 09:30:00', status: 'Out for delivery' },
                { location: '25.7617,-80.1918', timestamp: '2024-03-08 13:15:00', status: 'Delivered' }
            ]),
            total_amount: 799.99,
            items: JSON.stringify(['Smart TV', 'Wall Mount', 'HDMI Cables']),
            created_at: '2024-03-07 10:00:00',
            estimated_delivery: '2024-03-08 17:00:00'
        }
    ];

    const stmt = db.prepare(`INSERT INTO orders (
        order_number, customer_name, delivery_address, status, 
        current_location, location_history, total_amount, items, 
        created_at, estimated_delivery
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    orders.forEach(order => {
        stmt.run([
            order.order_number,
            order.customer_name,
            order.delivery_address,
            order.status,
            order.current_location,
            order.location_history,
            order.total_amount,
            order.items,
            order.created_at,
            order.estimated_delivery
        ]);
    });

    stmt.finalize();
    console.log('Database seeded successfully!');
});