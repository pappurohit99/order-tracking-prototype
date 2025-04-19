document.addEventListener('DOMContentLoaded', async function() {
    const orderNumber = new URLSearchParams(window.location.search).get('orderNumber');
    const order = await fetchOrder(orderNumber);
    renderModificationForm(order);
});

async function fetchOrder(orderNumber) {
    const response = await fetch(`/api/orders/${orderNumber}`);
    return response.json();
}
function renderModificationForm(order) {
    document.getElementById('modificationContainer').innerHTML = `
        <h2>Modify Order #${order.order_number}</h2>
        <form id="modificationForm" class="mt-4">
            <div class="mb-3">
                <label>Delivery Address</label>
                <input type="text" class="form-control" name="delivery_address" value="${order.delivery_address}">
            </div>
            <div class="mb-3">
                <label>Estimated Delivery</label>
                <input type="datetime-local" class="form-control" name="estimated_delivery" 
                       value="${new Date(order.estimated_delivery).toISOString().slice(0, 16)}">
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <a href="/" class="btn btn-secondary">Back to Dashboard</a>
        </form>
    `;

    setupFormHandler(order.order_number);
}

function setupFormHandler(orderNumber) {
    document.getElementById('modificationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`/api/orders/${orderNumber}/modify`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            
            if (response.ok) {
                window.location.href = `/order-details.html?orderNumber=${orderNumber}`;
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    });
}