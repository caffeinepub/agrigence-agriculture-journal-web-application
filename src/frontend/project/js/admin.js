// Admin Panel Module
// Handles admin-only functionality

(function(window) {
    'use strict';

    let currentAdmin = null;
    let selectedUser = null;

    function init() {
        // Check admin authentication
        if (!window.Auth.requireAdmin()) {
            document.getElementById('admin-gate').style.display = 'block';
            setTimeout(() => {
                window.location.href = './index.html';
            }, 3000);
            return;
        }

        currentAdmin = window.Auth.getCurrentUser();
        document.getElementById('admin-name-display').textContent = currentAdmin.name;
        document.getElementById('admin-content').style.display = 'block';

        // Load users
        loadUsers();

        // Event listeners
        document.getElementById('admin-logout-btn').addEventListener('click', handleLogout);
        document.getElementById('search-users-btn').addEventListener('click', handleSearch);
        document.getElementById('close-user-details').addEventListener('click', closeUserDetails);
        document.getElementById('admin-payment-form').addEventListener('submit', handlePaymentUpdate);
        document.getElementById('admin-password-reset-form').addEventListener('submit', handlePasswordReset);

        // Modal
        const modal = document.getElementById('submission-modal');
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        document.getElementById('submission-edit-form').addEventListener('submit', handleSubmissionUpdate);
    }

    function loadUsers(searchTerm = '') {
        const users = window.DB.getAllUsers();
        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = '';

        const filtered = searchTerm 
            ? users.filter(u => 
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : users;

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found</td></tr>';
            return;
        }

        filtered.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.occupation}</td>
                <td><button class="btn btn-small" onclick="window.AdminPanel.selectUser('${user.id}')">View Details</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function handleSearch() {
        const searchTerm = document.getElementById('user-search').value;
        loadUsers(searchTerm);
    }

    function selectUser(userId) {
        selectedUser = window.DB.findUserById(userId);
        if (!selectedUser) return;

        document.getElementById('selected-user-name').textContent = selectedUser.name;
        document.getElementById('user-details-section').style.display = 'block';

        // Load profile
        document.getElementById('admin-view-name').textContent = selectedUser.name;
        document.getElementById('admin-view-email').textContent = selectedUser.email;
        document.getElementById('admin-view-phone').textContent = selectedUser.phone;
        document.getElementById('admin-view-gender').textContent = selectedUser.gender || 'Not specified';
        document.getElementById('admin-view-dob').textContent = selectedUser.dob || 'Not specified';
        document.getElementById('admin-view-occupation').textContent = selectedUser.occupation;
        document.getElementById('admin-view-organization').textContent = selectedUser.organization || 'Not specified';
        document.getElementById('admin-view-address').textContent = selectedUser.address || 'Not specified';

        if (selectedUser.profilePhoto) {
            document.getElementById('admin-view-profile-photo').src = selectedUser.profilePhoto;
        } else {
            document.getElementById('admin-view-profile-photo').src = './assets/default-avatar.png';
        }

        // Load payment
        const payment = window.DB.getPaymentByUserId(selectedUser.id);
        if (payment) {
            document.getElementById('admin-payment-status').value = payment.status;
            document.getElementById('admin-payment-amount').value = payment.amount;
            document.getElementById('admin-payment-date').value = payment.date;
            document.getElementById('admin-payment-id').value = payment.paymentId;
            document.getElementById('admin-payment-method').value = payment.method;
            document.getElementById('admin-receipt-path').value = payment.receiptPath || '';
        } else {
            document.getElementById('admin-payment-form').reset();
        }

        // Load submissions
        loadUserSubmissions(selectedUser.id);

        // Scroll to details
        document.getElementById('user-details-section').scrollIntoView({ behavior: 'smooth' });
    }

    function loadUserSubmissions(userId) {
        const submissions = window.DB.getSubmissionsByUserId(userId);
        const tbody = document.getElementById('admin-submissions-tbody');
        tbody.innerHTML = '';

        if (submissions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No submissions</td></tr>';
            return;
        }

        submissions.forEach(sub => {
            const tr = document.createElement('tr');
            const statusClass = sub.status.toLowerCase().replace(' ', '-');
            tr.innerHTML = `
                <td>${sub.id}</td>
                <td>${sub.title}</td>
                <td>${sub.date}</td>
                <td><span class="badge badge-${statusClass}">${sub.status}</span></td>
                <td><button class="btn btn-small" onclick="window.AdminPanel.editSubmission('${sub.id}')">Edit</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function editSubmission(submissionId) {
        const submission = window.DB.getSubmissionById(submissionId);
        if (!submission) return;

        document.getElementById('edit-submission-id').value = submissionId;
        document.getElementById('edit-submission-status').value = submission.status;
        document.getElementById('edit-submission-remarks').value = submission.remarks;
        document.getElementById('submission-modal').classList.add('active');
    }

    function handleSubmissionUpdate(e) {
        e.preventDefault();
        const submissionId = document.getElementById('edit-submission-id').value;
        const status = document.getElementById('edit-submission-status').value;
        const remarks = document.getElementById('edit-submission-remarks').value;

        const updated = window.DB.updateSubmission(submissionId, { status, remarks });
        if (updated) {
            showMessage('submission-edit-message', 'Submission updated successfully', 'success');
            setTimeout(() => {
                document.getElementById('submission-modal').classList.remove('active');
                loadUserSubmissions(selectedUser.id);
            }, 1500);
        } else {
            showMessage('submission-edit-message', 'Failed to update submission', 'error');
        }
    }

    function closeUserDetails() {
        document.getElementById('user-details-section').style.display = 'none';
        selectedUser = null;
    }

    function handlePaymentUpdate(e) {
        e.preventDefault();
        if (!selectedUser) return;

        const paymentData = {
            status: document.getElementById('admin-payment-status').value,
            amount: document.getElementById('admin-payment-amount').value,
            date: document.getElementById('admin-payment-date').value,
            paymentId: document.getElementById('admin-payment-id').value,
            method: document.getElementById('admin-payment-method').value,
            receiptPath: document.getElementById('admin-receipt-path').value || './receipts/mock-receipt.pdf',
            receiptNumber: 'RCP-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000)
        };

        window.DB.updatePayment(selectedUser.id, paymentData);
        showMessage('payment-update-message', 'Payment updated successfully', 'success');
    }

    function handlePasswordReset(e) {
        e.preventDefault();
        if (!selectedUser) return;

        const newPass = document.getElementById('admin-new-password').value;
        const confirm = document.getElementById('admin-confirm-password').value;

        if (newPass !== confirm) {
            showMessage('admin-password-message', 'Passwords do not match', 'error');
            return;
        }

        window.DB.updateUser(selectedUser.id, { password: newPass });
        showMessage('admin-password-message', 'Password reset successfully', 'success');
        e.target.reset();
    }

    function handleLogout() {
        window.Auth.logout();
        window.location.href = './index.html';
    }

    function showMessage(elementId, message, type) {
        const el = document.getElementById(elementId);
        el.textContent = message;
        el.className = 'message-area ' + type;
        setTimeout(() => {
            el.className = 'message-area';
        }, 5000);
    }

    // Export for global access
    window.AdminPanel = {
        selectUser,
        editSubmission
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window);
