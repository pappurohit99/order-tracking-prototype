const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/api/order', (req, res) => {
    const orderDetails = {
        id: '12345',
        status: 'In Transit',
        estimatedDelivery: '2025-04-20',
        location: {
            lat: 37.7749,
            lng: -122.4194
        }
    };
    res.json(orderDetails);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
