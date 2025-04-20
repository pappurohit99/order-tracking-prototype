let map;

document.addEventListener('DOMContentLoaded', async function() {
    // Log the full URL and parameters for verification
    console.log('URL:', window.location.href);
    console.log('Search params:', window.location.search);
    
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('orderNumber');
    
    if (orderNumber) {
        const response = await fetch(`/api/orders/${orderNumber}`);
        const order = await response.json();
        displayOrderDetails(order);
        initializeMap(order);
    }
});
function displayOrderDetails(order) {
    // Add null checks before accessing properties
    const status = order.status || 'N/A';
    const customerName = order.customer_name || 'N/A';
    const deliveryAddress = order.delivery_address || 'N/A';
    const estimatedDelivery = order.estimated_delivery || 'N/A';

    document.getElementById('orderStatus').textContent = status;
    document.getElementById('customerName').textContent = customerName;
    document.getElementById('deliveryAddress').textContent = deliveryAddress;
    document.getElementById('estimatedDelivery').textContent = estimatedDelivery;

    // Handle location history with null check
    if (order.location_history) {
        const locationHistory = JSON.parse(order.location_history);
        displayLocationHistory(locationHistory);
    }
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