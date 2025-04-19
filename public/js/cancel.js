document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cancelForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const confirmCancel = confirm('Are you sure you want to cancel this order?');
        
        if (confirmCancel) {
            const formData = new FormData(this);
            const cancelData = Object.fromEntries(formData.entries());
            
            console.log('Cancellation data:', cancelData);
            alert('Order cancelled successfully!');
            window.location.href = '/';
        }
    });
});