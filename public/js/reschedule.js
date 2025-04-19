document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('rescheduleForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const rescheduleData = Object.fromEntries(formData.entries());
        
        console.log('Reschedule data:', rescheduleData);
        alert('Order rescheduled successfully!');
        window.location.href = '/';
    });
});