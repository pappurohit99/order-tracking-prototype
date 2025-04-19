document.addEventListener('DOMContentLoaded', () => {
    // Fetch order details from the server
    fetch('/api/order')
        .then(response => response.json())
        .then(data => {
            displayOrderDetails(data);
            initializeMap(data.location);
            setupNotificationSettings(data.notifications);
        })
        .catch(error => console.error('Error fetching order details:', error));
});

function displayOrderDetails(order) {
    const orderInfo = document.getElementById('order-info');
    orderInfo.innerHTML = `
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>
    `;
}

function initializeMap(location) {
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Set the correct icon paths
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });

    // Add a marker
    const marker = L.marker([51.5, -0.09]).addTo(map);
}

function setupNotificationSettings(notifications) {
    const realTimeUpdates = document.getElementById('real-time-updates');
    const smsNotifications = document.getElementById('sms-notifications');

    realTimeUpdates.checked = notifications.realTimeUpdates;
    smsNotifications.checked = notifications.smsNotifications;

    realTimeUpdates.addEventListener('change', (event) => {
        updateNotificationSettings('realTimeUpdates', event.target.checked);
    });

    smsNotifications.addEventListener('change', (event) => {
        updateNotificationSettings('smsNotifications', event.target.checked);
    });
}

function updateNotificationSettings(setting, value) {
    fetch('/api/notifications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [setting]: value })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Notification settings updated:', data);
        })
        .catch(error => console.error('Error updating notification settings:', error));
}
const customIcon = L.icon({
    iconUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41]
});