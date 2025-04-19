document.addEventListener('DOMContentLoaded', async function() {
    const orderNumber = new URLSearchParams(window.location.search).get('orderNumber');
    const order = await fetchOrder(orderNumber);
    renderRescheduleForm(order);
});

async function fetchOrder(orderNumber) {
    const response = await fetch(`/api/orders/${orderNumber}`);
    return response.json();
}

function renderRescheduleForm(order) {
    const currentDate = new Date(order.estimated_delivery).toISOString().slice(0, 16);
    
    document.getElementById('rescheduleContainer').innerHTML = `
        <h2>Reschedule Order #${order.order_number}</h2>
        <div class="card mt-4">
            <div class="card-body">
                <h5>Current Delivery Details</h5>
                <p>Current Delivery Date: ${new Date(order.estimated_delivery).toLocaleString()}</p>
                <form id="rescheduleForm">
                    <div class="mb-3">
                        <label>New Delivery Date</label>
                        <input type="datetime-local" class="form-control" 
                               name="new_delivery_date" 
                               min="${new Date().toISOString().slice(0, 16)}"
                               value="${currentDate}" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Confirm Reschedule</button>
                    <a href="/" class="btn btn-secondary">Back to Dashboard</a>
                </form>
            </div>
        </div>
    `;

    setupRescheduleHandler(order.order_number);
}

function setupRescheduleHandler(orderNumber) {
    document.getElementById('rescheduleForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = {
            new_delivery_date: formData.get('new_delivery_date')
        };
        
        try {
            const response = await fetch(`/api/orders/${orderNumber}/reschedule`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            
            if (response.ok) {
                alert('Order rescheduled successfully');
                window.location.href = `/order-details.html?orderNumber=${orderNumber}`;
            }
        } catch (error) {
            console.error('Error rescheduling order:', error);
        }
    });
}