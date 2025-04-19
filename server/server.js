const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const port = 3000;

// API routes first
app.use(express.json());

// Get all orders
app.get('/api/orders', (req, res) => {
    db.all('SELECT * FROM orders', [], (err, rows) => {
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
    console.log('Attempting to fetch order:', orderNumber);
    
    const query = 'SELECT * FROM orders WHERE order_number = ?';
    console.log('Executing query:', query, 'with parameter:', orderNumber);
    
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
        console.log('Found order:', order);
        res.json(order);
    });
});
// Static files after API routes
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});