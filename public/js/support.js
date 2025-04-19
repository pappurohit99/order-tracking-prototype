document.addEventListener('DOMContentLoaded', function() {
    // Live Chat Handler
    document.getElementById('startChatBtn').addEventListener('click', function() {
        alert('Connecting to support agent...');
        // Here you would typically initialize your chat widget
    });

    // Support Ticket Handler
    document.getElementById('supportForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Support ticket created successfully!');
        window.location.href = '/';
    });
});