document.getElementById('modificationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(this);
    const modifications = Object.fromEntries(formData.entries());
    
    // Add checkbox values
    modifications.giftWrap = document.getElementById('giftWrap').checked;
    modifications.signature = document.getElementById('signature').checked;
    
    // Here you would typically send this to your backend
    console.log('Order modifications:', modifications);
    
    // Show success message
    alert('Modifications submitted successfully!');
    window.location.href = '/';
});