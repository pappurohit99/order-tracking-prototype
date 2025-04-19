const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

let orderDetails = {
    id: '12345',
    status: 'In Transit',
    estimatedDelivery: '2025-04-20',
    location: {
        lat: 37.7749,
        lng: -122.4194
    },
    notifications: {
        realTimeUpdates: true,
        smsNotifications: false
    }
};

app.get('/api/order', (req, res) => {
    res.json(orderDetails);
});

app.post('/api/notifications', (req, res) => {
    const { realTimeUpdates, smsNotifications } = req.body;
    if (realTimeUpdates !== undefined) {
        orderDetails.notifications.realTimeUpdates = realTimeUpdates;
    }
    if (smsNotifications !== undefined) {
        orderDetails.notifications.smsNotifications = smsNotifications;
    }
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
