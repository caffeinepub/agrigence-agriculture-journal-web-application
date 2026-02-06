// Authentication Module
// Handles login, registration, forgot password, and session management

(function(window) {
    'use strict';

    // Check if user is authenticated
    function isAuthenticated() {
        const session = window.DB.getSession();
        return session !== null;
    }

    // Get current user
    function getCurrentUser() {
        const session = window.DB.getSession();
        if (!session) return null;
        return window.DB.findUserById(session.userId);
    }

    // Login
    function login(email, password) {
        const user = window.DB.findUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        if (user.password !== password) {
            return { success: false, message: 'Incorrect password' };
        }
        window.DB.createSession(user.id);
        return { success: true, user };
    }

    // Register
    function register(userData) {
        const existing = window.DB.findUserByEmail(userData.email);
        if (existing) {
            return { success: false, message: 'Email already registered' };
        }
        if (userData.password !== userData.confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }
        const newUser = window.DB.createUser(userData);
        return { success: true, user: newUser };
    }

    // Forgot password - verify user details
    function verifyForgotPassword(email, phone, dob, occupation) {
        const user = window.DB.findUserByEmail(email);
        if (!user) {
            return { success: false, message: 'No user found with this email' };
        }
        if (user.phone !== phone || user.dob !== dob || user.occupation !== occupation) {
            return { success: false, message: 'Details do not match our records' };
        }
        return { success: true, user };
    }

    // Reset password
    function resetPassword(email, newPassword) {
        const user = window.DB.findUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        window.DB.updateUser(user.id, { password: newPassword });
        return { success: true };
    }

    // Change password
    function changePassword(userId, currentPassword, newPassword) {
        const user = window.DB.findUserById(userId);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        if (user.password !== currentPassword) {
            return { success: false, message: 'Current password is incorrect' };
        }
        window.DB.updateUser(userId, { password: newPassword });
        return { success: true };
    }

    // Logout
    function logout() {
        window.DB.clearSession();
    }

    // Redirect if not authenticated
    function requireAuth() {
        if (!isAuthenticated()) {
            window.location.href = './index.html';
            return false;
        }
        return true;
    }

    // Redirect if authenticated
    function requireGuest() {
        if (isAuthenticated()) {
            window.location.href = './dashboard.html';
            return false;
        }
        return true;
    }

    // Require admin
    function requireAdmin() {
        if (!isAuthenticated()) {
            window.location.href = './index.html';
            return false;
        }
        const user = getCurrentUser();
        if (!user || !user.isAdmin) {
            return false;
        }
        return true;
    }

    // Export API
    window.Auth = {
        isAuthenticated,
        getCurrentUser,
        login,
        register,
        verifyForgotPassword,
        resetPassword,
        changePassword,
        logout,
        requireAuth,
        requireGuest,
        requireAdmin
    };

})(window);
