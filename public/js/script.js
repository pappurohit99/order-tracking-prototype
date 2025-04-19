document.addEventListener('DOMContentLoaded', () => {
    // Fetch order details from the server
    fetch('/api/order')
        .then(response => response.json())
        .then(data => {
            displayOrderDetails(data);
            initializeMap(data.location);
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
    const map = L.map('mapid').setView([location.lat, location.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([location.lat, location.lng]).addTo(map)
        .bindPopup('Your order is here.')
        .openPopup();
}
