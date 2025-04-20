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
    
    if (action === 'cancel' || action === 'reschedule' || action === 'modify') {
        sql = "SELECT * FROM orders WHERE status = 'In Transit'";
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
    const updates = req.body;

    // Get current order data
    db.get('SELECT * FROM orders WHERE order_number = ?', [orderNumber], (err, currentOrder) => {
        if (err) return res.status(500).json({ error: err.message });

        // Preserve existing values if not in updates
        const updatedData = {
            delivery_address: updates.delivery_address || currentOrder.delivery_address,
            estimated_delivery: updates.estimated_delivery || currentOrder.estimated_delivery
        };

        db.run(`UPDATE orders SET 
            delivery_address = ?,
            estimated_delivery = ?,
            location_history = json_insert(location_history, '$[#]', json(?))
            WHERE order_number = ?`,
            [updatedData.delivery_address, updatedData.estimated_delivery,
                JSON.stringify({
                    status: 'Order Modified',
                    timestamp: new Date().toISOString(),
                    changes: updates
                }), orderNumber],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Order modified successfully', order: updatedData });
            });
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
app.put('/api/orders/:orderNumber/cancel', (req, res) => {
    const { orderNumber } = req.params;
    
    db.run(`UPDATE orders SET 
        status = 'Cancelled',
        location_history = json_insert(location_history, '$[#]', json(?))
        WHERE order_number = ?`,
        [JSON.stringify({
            status: 'Cancelled',
            timestamp: new Date().toISOString()
        }), orderNumber],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Order cancelled successfully' });
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});