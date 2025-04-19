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
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'order-details-container';
    detailsContainer.innerHTML = `
        <h2>Order #${order.order_number}</h2>
        <div class="status-badge ${order.status.toLowerCase()}">${order.status}</div>
        <div class="delivery-details">
            <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>
            <p><strong>Customer:</strong> ${order.customer_name}</p>
            <p><strong>Estimated Delivery:</strong> ${new Date(order.estimated_delivery).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ${order.total_amount}</p>
        </div>
        <div class="tracking-history">
            <h3>Tracking History</h3>
            <ul class="list-group">
                ${JSON.parse(order.location_history).map(location => `
                    <li class="list-group-item">
                        ${location.status} - ${new Date(location.timestamp).toLocaleString()}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    const mapElement = document.getElementById('map');
    mapElement.parentNode.insertBefore(detailsContainer, mapElement);
}function initializeMap(order) {
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