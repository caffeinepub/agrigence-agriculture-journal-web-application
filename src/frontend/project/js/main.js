// Main Application Entry Point
// Detects which page is open and initializes appropriate logic

(function(window) {
    'use strict';

    // Determine current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Page-specific initialization
    if (currentPage === 'index.html' || currentPage === '') {
        initIndexPage();
    } else if (currentPage === 'dashboard.html') {
        // Dashboard initialization is handled in dashboard.js
    } else if (currentPage === 'admin.html') {
        // Admin initialization is handled in admin.js
    }

    function initIndexPage() {
        // Redirect if already authenticated
        if (window.Auth.isAuthenticated()) {
            window.location.href = './dashboard.html';
            return;
        }

        // View switching
        const loginView = document.getElementById('login-view');
        const registerView = document.getElementById('register-view');
        const forgotView = document.getElementById('forgot-view');

        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.display = 'none';
            registerView.style.display = 'block';
            forgotView.style.display = 'none';
        });

        document.getElementById('show-forgot').addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.display = 'none';
            registerView.style.display = 'none';
            forgotView.style.display = 'block';
        });

        document.getElementById('show-login-from-register').addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.display = 'block';
            registerView.style.display = 'none';
            forgotView.style.display = 'none';
        });

        document.getElementById('show-login-from-forgot').addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.display = 'block';
            registerView.style.display = 'none';
            forgotView.style.display = 'block';
        });

        // Login form
        document.getElementById('login-form').addEventListener('submit', handleLogin);

        // Register form
        document.getElementById('register-form').addEventListener('submit', handleRegister);

        // Forgot password form
        document.getElementById('forgot-form').addEventListener('submit', handleForgotPassword);

        // New password form
        document.getElementById('new-password-form').addEventListener('submit', handleNewPassword);
    }

    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const result = window.Auth.login(email, password);
        if (result.success) {
            window.location.href = result.user.isAdmin ? './admin.html' : './dashboard.html';
        } else {
            showMessage('login-message', result.message, 'error');
        }
    }

    function handleRegister(e) {
        e.preventDefault();
        const userData = {
            name: document.getElementById('register-name').value,
            email: document.getElementById('register-email').value,
            phone: document.getElementById('register-phone').value,
            dob: document.getElementById('register-dob').value,
            gender: document.getElementById('register-gender').value,
            occupation: document.getElementById('register-occupation').value,
            organization: document.getElementById('register-organization').value,
            address: document.getElementById('register-address').value,
            password: document.getElementById('register-password').value,
            confirmPassword: document.getElementById('register-confirm-password').value
        };

        const result = window.Auth.register(userData);
        if (result.success) {
            showMessage('register-message', 'Registration successful! Please login.', 'success');
            setTimeout(() => {
                document.getElementById('show-login-from-register').click();
            }, 2000);
        } else {
            showMessage('register-message', result.message, 'error');
        }
    }

    let verifiedEmail = null;

    function handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        const phone = document.getElementById('forgot-phone').value;
        const dob = document.getElementById('forgot-dob').value;
        const occupation = document.getElementById('forgot-occupation').value;

        const result = window.Auth.verifyForgotPassword(email, phone, dob, occupation);
        if (result.success) {
            verifiedEmail = email;
            document.getElementById('forgot-form').style.display = 'none';
            document.getElementById('new-password-form').style.display = 'block';
            showMessage('forgot-message', 'Verification successful! Set your new password.', 'success');
        } else {
            showMessage('forgot-message', result.message, 'error');
        }
    }

    function handleNewPassword(e) {
        e.preventDefault();
        const newPass = document.getElementById('new-password').value;
        const confirm = document.getElementById('confirm-new-password').value;

        if (newPass !== confirm) {
            showMessage('new-password-message', 'Passwords do not match', 'error');
            return;
        }

        const result = window.Auth.resetPassword(verifiedEmail, newPass);
        if (result.success) {
            showMessage('new-password-message', 'Password reset successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = './index.html';
            }, 2000);
        } else {
            showMessage('new-password-message', result.message, 'error');
        }
    }

    function showMessage(elementId, message, type) {
        const el = document.getElementById(elementId);
        el.textContent = message;
        el.className = 'message-area ' + type;
        setTimeout(() => {
            el.className = 'message-area';
        }, 5000);
    }

})(window);
