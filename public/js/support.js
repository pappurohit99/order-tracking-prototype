document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('orderNumber');

    document.getElementById('supportForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const ticketId = Math.floor(Math.random() * 1000000);
        
        const formData = {
            issueType: document.getElementById('issueType').value,
            description: document.getElementById('description').value
        };

        try {
            const response = await fetch(`/api/orders/${orderNumber}/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(`Support ticket created successfully!\nTicket ID: ${ticketId}`);
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error creating support ticket:', error);
        }
    });
});async function fetchOrder(orderNumber) {
    const response = await fetch(`/api/orders/${orderNumber}`);
    return response.json();
}
function renderSupportForm(order) {
    document.getElementById('supportContainer').innerHTML = `
        <h2>Support for Order #${order.order_number}</h2>
        <div class="row mt-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5>Create Support Ticket</h5>
                        <form id="supportForm">
                            <div class="mb-3">
                                <label>Issue Type</label>
                                <select class="form-control" name="issueType" required>
                                    <option value="delivery">Delivery Issue</option>
                                    <option value="product">Product Issue</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label>Description</label>
                                <textarea class="form-control" name="description" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit Ticket</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5>Live Chat Support</h5>
                        <button id="startChatBtn" class="btn btn-success">Start Chat</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}