document.addEventListener('DOMContentLoaded', async function() {
    const orderNumber = new URLSearchParams(window.location.search).get('orderNumber');
    const order = await fetchOrder(orderNumber);
    renderCancelForm(order);
});

async function fetchOrder(orderNumber) {
    const response = await fetch(`/api/orders/${orderNumber}`);
    return response.json();
}

function renderCancelForm(order) {
    document.getElementById('cancelContainer').innerHTML = `
        <h2>Cancel Order #${order.order_number}</h2>
        <div class="card mt-4">
            <div class="card-body">
                <h5>Order Details</h5>
                <p>Customer: ${order.customer_name}</p>
                <p>Status: ${order.status}</p>
                <p>Delivery Address: ${order.delivery_address}</p>
                <form id="cancelForm">
                    <div class="alert alert-warning">
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </div>
                    <button type="submit" class="btn btn-danger">Confirm Cancellation</button>
                    <a href="/" class="btn btn-secondary">Back to Dashboard</a>
                </form>
            </div>
        </div>
    `;

    setupCancelHandler(order.order_number);
}

function setupCancelHandler(orderNumber) {
    document.getElementById('cancelForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/orders/${orderNumber}/cancel`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                alert('Order cancelled successfully');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    });
}