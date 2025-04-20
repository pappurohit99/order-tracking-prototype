document.addEventListener('DOMContentLoaded', function() {
    fetchOrderStats();

    // Unified modal function for all operations
    async function showOrderSelectionModal(action, targetPage) {
        const response = await fetch(`/api/orders?action=${action}`);
        const orders = await response.json();
        
        const modalTitle = {
            'status': 'View Order Status',
            'modify': 'Modify Order',
            'reschedule': 'Reschedule Order',
            'cancel': 'Cancel Order',
            'support': 'Get Support for Order'
        };

        const orderList = document.createElement('div');
        orderList.className = 'order-selection-modal';
        orderList.innerHTML = `
            <div class="modal fade show" style="display: block">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${modalTitle[action]}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${orders.map(order => `
                                <div class="order-item mb-2">
                                    <a href="/${targetPage}.html?orderNumber=${order.order_number}" 
                                       class="btn btn-outline-primary w-100">
                                        Order #${order.order_number} - ${order.customer_name}
                                        <small class="d-block">${order.status}</small>
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade show"></div>
        `;
        
        document.body.appendChild(orderList);
        
        function closeModal() {
            document.body.removeChild(orderList);
        }

        orderList.querySelector('.btn-close').addEventListener('click', closeModal);
        orderList.addEventListener('click', function(e) {
            if (e.target.matches('.modal, .modal-backdrop')) {
                closeModal();
            }
        });
    }
    // Unified button handlers
    const operations = {
        'orderStatusBtn': ['status', 'order-details'],
        'orderModificationBtn': ['modify', 'order-modification'],
        'rescheduleBtn': ['reschedule', 'reschedule'],
        'cancelBtn': ['cancel', 'cancel'],
        'supportBtn': ['support', 'support']
    };

    Object.entries(operations).forEach(([btnId, [action, page]]) => {
        document.getElementById(btnId).addEventListener('click', () => 
            showOrderSelectionModal(action, page)
        );
    });
});
async function fetchOrderStats() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();

        const stats = {
            inTransit: orders.filter(order => order.status === 'In Transit').length,
            delivered: orders.filter(order => order.status === 'Delivered').length,
            total: orders.length
        };

        // Calculate average delivery time
        const avgDeliveryTime = calculateAverageDeliveryTime(orders);

        // Update stats as before
        updateDashboardStats(stats, avgDeliveryTime);

        // Add order list to dashboard
        displayOrderList(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}
function displayOrderList(orders) {
    const orderList = document.createElement('div');
    orderList.className = 'row mt-4';
    orderList.innerHTML = `
        <h2>Recent Orders</h2>
        ${orders.map(order => `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Order #${order.order_number}</h5>
                        <p class="card-text">Status: ${order.status}</p>
                        <p class="card-text">Customer: ${order.customer_name}</p>
                        <a href="/order-details.html?orderNumber=${order.order_number}" 
                            class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </div>
        `).join('')}
    `;

    // Update selector to match your HTML structure
    document.querySelector('.container-fluid').appendChild(orderList);
}
function calculateAverageDeliveryTime(orders) {
    const deliveredOrders = orders.filter(order => order.status === 'Delivered');
    const totalDays = deliveredOrders.reduce((acc, order) => {
        const created = new Date(order.created_at);
        const delivered = new Date(order.estimated_delivery);
        const days = (delivered - created) / (1000 * 60 * 60 * 24);
        return acc + days;
    }, 0);

    return (totalDays / deliveredOrders.length).toFixed(1);
}

function updateDashboardStats(stats, avgDeliveryTime) {
    const cards = document.querySelectorAll('.card-text');
    cards[0].textContent = stats.inTransit;
    cards[1].textContent = stats.delivered;
    cards[2].textContent = stats.total;
    cards[3].textContent = `${avgDeliveryTime} days`;
}

async function cancelOrder(orderNumber) {
    const response = await fetch(`/api/orders/${orderNumber}/cancel`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = await response.json();
    if (result.message) {
        // Refresh the order list to show updated status
        fetchOrderStats();
    }
}

async function modifyOrder(orderNumber, modifiedData) {
    const response = await fetch(`/api/orders/${orderNumber}/modify`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(modifiedData)
    });
    const result = await response.json();
    if (result.message) {
        // Refresh the order list to show updated details
        fetchOrderStats();
    }
}