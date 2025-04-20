let map;

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('orderNumber');

    if (orderNumber) {
        const response = await fetch(`/api/orders/${orderNumber}`);
        const order = await response.json();
        displayOrderDetails(order);
    }
});

function displayOrderDetails(order) {
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
}

function initializeMap(order) {
    const [lat, lng] = order.current_location.split(',');
    
    map = L.map('map').setView([lat, lng], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`Current Location: ${order.status}`);
}