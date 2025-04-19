document.addEventListener('DOMContentLoaded', async function() {
    const orderNumber = new URLSearchParams(window.location.search).get('orderNumber');
    const order = await fetchOrder(orderNumber);
    renderSupportForm(order);

    // Live Chat Handler
    document.getElementById('startChatBtn').addEventListener('click', () => {
        alert('Live chat feature coming soon!');
    });

    // Support Ticket Handler
    document.getElementById('supportForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const ticketData = {
            issueType: formData.get('issueType'),
            description: formData.get('description')
        };
        
        try {
            const response = await fetch(`/api/orders/${orderNumber}/support`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData)
            });
            
            if (response.ok) {
                alert('Support ticket created successfully');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error creating support ticket:', error);
        }
    });});

async function fetchOrder(orderNumber) {
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