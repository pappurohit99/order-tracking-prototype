document.addEventListener('DOMContentLoaded', function() {
    // Main action buttons
    document.getElementById('orderStatusBtn').addEventListener('click', function() {
        window.location.href = '/order-details.html';
    });

    document.getElementById('orderModificationBtn').addEventListener('click', function() {
        window.location.href = '/order-modification.html';
    });

    document.getElementById('supportBtn').addEventListener('click', function() {
        window.location.href = '/support.html';
    });

    // Vertical action buttons
    document.getElementById('rescheduleBtn').addEventListener('click', function() {
        window.location.href = '/reschedule.html';
    });

    document.getElementById('cancelBtn').addEventListener('click', function() {
        window.location.href = '/cancel.html';
    });
});