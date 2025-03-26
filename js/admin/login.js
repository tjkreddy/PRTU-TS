document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    // Default credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "prtu2023";

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = passwordInput.value;
        
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Successful login
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'index.html';
        } else {
            // Failed login
            alert('Invalid credentials. Please try again.\nUsername: admin\nPassword: prtu2023');
        }
    });
});
