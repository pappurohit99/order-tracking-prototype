const express = require('express');
const db = require('./database');

const app = express();
const port = 3000;

// API routes first
app.use(express.json());

// Get all orders
app.get('/api/orders', (req, res) => {
    const { action } = req.query;
    let sql = 'SELECT * FROM orders';
    
    if (action === 'cancel' || action === 'reschedule') {
        sql = "SELECT * FROM orders WHERE status != 'Delivered'";
    }
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});
// Get single order by order_number
app.get('/api/orders/:orderNumber', (req, res) => {
    const orderNumber = req.params.orderNumber;
    const query = 'SELECT * FROM orders WHERE order_number = ?';

    db.get(query, [orderNumber], (err, order) => {
        if (err) {
            console.log('Database error:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (!order) {
            console.log('No order found for:', orderNumber);
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.json(order);
    });
});
// Static files after API routes
app.use(express.static('public'));

// Modify order endpoint (enhanced)
app.put('/api/orders/:orderNumber/modify', (req, res) => {
    const { orderNumber } = req.params;
    const { delivery_address, estimated_delivery } = req.body;

    // First get existing order data
    db.get('SELECT * FROM orders WHERE order_number = ?', [orderNumber], (err, existingOrder) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Use new values or keep existing ones
        const updatedAddress = delivery_address || existingOrder.delivery_address;
        const updatedDelivery = estimated_delivery || existingOrder.estimated_delivery;

        // Update with preserved values
        db.run(`UPDATE orders SET 
            delivery_address = ?,
            estimated_delivery = ?,
            location_history = json_insert(location_history, '$[#]', json(?))
            WHERE order_number = ?`,
            [updatedAddress, updatedDelivery,
                JSON.stringify({
                    status: 'Order Modified',
                    timestamp: new Date().toISOString(),
                    location: null
                }), orderNumber],
            (updateErr) => {
                if (updateErr) return res.status(500).json({ error: updateErr.message });
                res.json({ message: 'Order modified successfully' });
            });
    });
});
// New cancel order endpoint
app.put('/api/orders/:orderNumber/cancel', (req, res) => {
    const { orderNumber } = req.params;

    db.run(`UPDATE orders SET 
        status = 'Cancelled',
        location_history = json_insert(location_history, '$[#]', json(?))
        WHERE order_number = ?`,
        [JSON.stringify({
            status: 'Order Cancelled',
            timestamp: new Date().toISOString(),
            location: null
        }), orderNumber],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Order cancelled successfully' });
        });
});
app.put('/api/orders/:orderNumber/reschedule', (req, res) => {
    const { orderNumber } = req.params;
    const { new_delivery_date } = req.body;

    db.run(`UPDATE orders SET 
        estimated_delivery = ?,
        location_history = json_insert(location_history, '$[#]', json(?))
        WHERE order_number = ?`,
        [new_delivery_date,
            JSON.stringify({
                status: 'Delivery Rescheduled',
                timestamp: new Date().toISOString(),
                location: null
            }), orderNumber],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Order rescheduled successfully' });
        });
});

app.post('/api/orders/:orderNumber/support', (req, res) => {
    const { orderNumber } = req.params;
    const { issueType, description } = req.body;

    // Create support ticket in database
    db.run(`INSERT INTO support_tickets (order_number, issue_type, description, status)
        VALUES (?, ?, ?, 'Open')`,
        [orderNumber, issueType, description],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Support ticket created successfully' });
        });
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});