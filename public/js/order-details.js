let map;

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('orderNumber');

    if (orderNumber) {
        const response = await fetch(`/api/orders/${orderNumber}`);
        const order = await response.json();
        displayOrderDetails(order);
    }
});

function displayOrderDetails(order) {
    // First render order details HTML
    const orderDetailsContainer = document.querySelector('.order-details');
    orderDetailsContainer.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Order Status</h5>
                <p id="orderStatus" class="card-text">${order.status}</p>
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Customer Details</h5>
                <p id="customerName" class="card-text">${order.customer_name}</p>
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Delivery Details</h5>
                <p id="deliveryAddress" class="card-text">${order.delivery_address}</p>
                <p id="estimatedDelivery" class="card-text">${order.estimated_delivery}</p>
            </div>
        </div>
    `;

    // Display location history
    const locationHistory = JSON.parse(order.location_history || '[]');
    const historyContainer = document.getElementById('locationHistory');
    historyContainer.innerHTML = locationHistory.map(entry => `
        <div class="alert alert-info">
            <strong>${entry.status}</strong>
            <p>${entry.timestamp}</p>
            ${entry.location ? `<p>Location: ${entry.location}</p>` : ''}
        </div>
    `).join('');

    // Initialize map (assuming you have a map implementation)
    initializeMap(order);

    // Set notification preferences
    const preferences = JSON.parse(order.notification_preferences);
    document.getElementById('smsNotification').checked = preferences.sms;
    document.getElementById('emailNotification').checked = preferences.email;
    document.getElementById('voiceAssistant').checked = preferences.voice_assistant;

    // Now add event listeners
    ['sms', 'email', 'voiceAssistant'].forEach(type => {
        const element = document.getElementById(`${type}Notification`);
        element.addEventListener('change', async (e) => {
            const newPreferences = {
                sms: document.getElementById('smsNotification').checked,
                email: document.getElementById('emailNotification').checked,
                voice_assistant: document.getElementById('voiceAssistant').checked
            };

            const response = await fetch(`/api/orders/${order.order_number}/notifications`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPreferences)
            });
        });
    });
} function initializeMap(order) {
    const locationHistory = JSON.parse(order.location_history);
    const lastLocation = locationHistory[locationHistory.length - 1];
    const coordinates = lastLocation.coordinates || [51.505, -0.09];

    const map = L.map('map').setView(coordinates, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker(coordinates)
        .bindPopup(`Status: ${lastLocation.status}<br>Location: ${lastLocation.location}`)
        .addTo(map);
}