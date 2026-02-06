// Dummy Database Module
// This module provides seed data and read/write helpers for the offline journal portal
// Integration Point: Replace localStorage operations with backend API calls

(function(window) {
    'use strict';

    const DB_KEY = 'journalPortalDB';

    // Default seed data
    const seedData = {
        users: [
            {
                id: 'admin-001',
                name: 'Admin User',
                email: 'admin@journal.com',
                password: 'admin123',
                phone: '+1234567890',
                gender: 'Male',
                dob: '1985-01-15',
                occupation: 'Professor',
                organization: 'Journal Portal',
                address: '123 Admin Street, City, Country',
                isAdmin: true,
                profilePhoto: null
            },
            {
                id: 'user-001',
                name: 'John Researcher',
                email: 'john@example.com',
                password: 'user123',
                phone: '+1987654321',
                gender: 'Male',
                dob: '1990-05-20',
                occupation: 'Researcher',
                organization: 'University of Science',
                address: '456 Research Ave, City, Country',
                isAdmin: false,
                profilePhoto: null
            }
        ],
        payments: [
            {
                userId: 'user-001',
                status: 'Paid',
                amount: '$150.00',
                date: '2026-01-15',
                paymentId: 'PAY-2026-001',
                method: 'Credit Card',
                receiptNumber: 'RCP-2026-001',
                receiptPath: './receipts/mock-receipt.pdf'
            }
        ],
        submissions: [
            {
                id: 'SUB-001',
                userId: 'user-001',
                title: 'Agricultural Innovation in Modern Farming',
                date: '2026-01-10',
                status: 'Under Review',
                fileName: 'sample-submission.pdf',
                filePath: './assets/sample-submission.pdf',
                remarks: 'Initial review pending'
            },
            {
                id: 'SUB-002',
                userId: 'user-001',
                title: 'Sustainable Crop Management Techniques',
                date: '2026-01-20',
                status: 'Revision Required',
                fileName: 'sample-submission.pdf',
                filePath: './assets/sample-submission.pdf',
                remarks: 'Please revise the methodology section and add more recent references.'
            }
        ],
        sessions: []
    };

    // Initialize database
    function initDB() {
        const stored = localStorage.getItem(DB_KEY);
        if (!stored) {
            localStorage.setItem(DB_KEY, JSON.stringify(seedData));
            return seedData;
        }
        return JSON.parse(stored);
    }

    // Get database
    function getDB() {
        const stored = localStorage.getItem(DB_KEY);
        return stored ? JSON.parse(stored) : seedData;
    }

    // Save database
    function saveDB(data) {
        // Integration Point: Replace with backend API call
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    }

    // User operations
    function findUserByEmail(email) {
        // Integration Point: Replace with backend API call
        const db = getDB();
        return db.users.find(u => u.email === email);
    }

    function findUserById(id) {
        // Integration Point: Replace with backend API call
        const db = getDB();
        return db.users.find(u => u.id === id);
    }

    function createUser(userData) {
        // Integration Point: Replace with backend API call
        const db = getDB();
        const newUser = {
            id: 'user-' + Date.now(),
            ...userData,
            isAdmin: false,
            profilePhoto: null
        };
        db.users.push(newUser);
        saveDB(db);
        return newUser;
    }

    function updateUser(userId, updates) {
        // Integration Point: Replace with backend API call
        const db = getDB();
        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            db.users[userIndex] = { ...db.users[userIndex], ...updates };
            saveDB(db);
            return db.users[userIndex];
        }
        return null;
    }

    function getAllUsers() {
        // Integration Point: Replace with backend API call
        const db = getDB();
        return db.users.filter(u => !u.isAdmin);
    }

    // Session operations
    function createSession(userId) {
        // Integration Point: Replace with backend session/token management
        const db = getDB();
        const token = 'token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const session = {
            token,
            userId,
            createdAt: new Date().toISOString()
        };
        db.sessions.push(session);
        saveDB(db);
        localStorage.setItem('currentSession', token);
        return session;
    }

    function getSession() {
        // Integration Point: Replace with backend session validation
        const token = localStorage.getItem('currentSession');
        if (!token) return null;
        const db = getDB();
        return db.sessions.find(s => s.token === token);
    }

    function clearSession() {
        // Integration Point: Replace with backend session invalidation
        localStorage.removeItem('currentSession');
    }

    // Payment operations
    function getPaymentByUserId(userId) {
        // Integration Point: Replace with backend API call
        const db = getDB();
        return db.payments.find(p => p.userId === userId);
    }

    function updatePayment(userId, paymentData) {
        // Integration Point: Replace with backend API call
        const db = getDB();
        const paymentIndex = db.payments.findIndex(p => p.userId === userId);
        if (paymentIndex !== -1) {
            db.payments[paymentIndex] = { ...db.payments[paymentIndex], ...paymentData };
        } else {
            db.payments.push({ userId, ...paymentData });
        }
        saveDB(db);
    }

    // Submission operations
    function getSubmissionsByUserId(userId) {
        // Integration Point: Replace with backend API call
        const db = getDB();
        return db.submissions.filter(s => s.userId === userId);
    }

    function updateSubmission(submissionId, updates) {
        // Integration Point: Replace with backend API call
        const db = getDB();
        const subIndex = db.submissions.findIndex(s => s.id === submissionId);
        if (subIndex !== -1) {
            db.submissions[subIndex] = { ...db.submissions[subIndex], ...updates };
            saveDB(db);
            return db.submissions[subIndex];
        }
        return null;
    }

    function getSubmissionById(submissionId) {
        // Integration Point: Replace with backend API call
        const db = getDB();
        return db.submissions.find(s => s.id === submissionId);
    }

    // Export API
    window.DB = {
        init: initDB,
        findUserByEmail,
        findUserById,
        createUser,
        updateUser,
        getAllUsers,
        createSession,
        getSession,
        clearSession,
        getPaymentByUserId,
        updatePayment,
        getSubmissionsByUserId,
        updateSubmission,
        getSubmissionById
    };

    // Initialize on load
    initDB();

})(window);
