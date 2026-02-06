// Dashboard Module
// Handles user dashboard functionality

(function(window) {
    'use strict';

    let currentUser = null;
    let isEditMode = false;

    function init() {
        // Check authentication
        if (!window.Auth.requireAuth()) return;

        currentUser = window.Auth.getCurrentUser();
        if (!currentUser) {
            window.location.href = './index.html';
            return;
        }

        // Display user name
        document.getElementById('user-name-display').textContent = currentUser.name;

        // Load all sections
        loadProfile();
        loadPaymentStatus();
        loadReceiptDetails();
        loadSubmissions();

        // Event listeners
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
        document.getElementById('edit-profile-btn').addEventListener('click', toggleEditMode);
        document.getElementById('save-profile-btn').addEventListener('click', saveProfile);
        document.getElementById('cancel-profile-btn').addEventListener('click', cancelEdit);
        document.getElementById('profile-photo-input').addEventListener('change', handlePhotoUpload);
        document.getElementById('upload-photo-btn').addEventListener('click', () => {
            document.getElementById('profile-photo-input').click();
        });
        document.getElementById('change-password-form').addEventListener('submit', handleChangePassword);

        // Modal close
        const modal = document.getElementById('reupload-modal');
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        document.getElementById('reupload-form').addEventListener('submit', handleReupload);
    }

    function loadProfile() {
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('profile-phone').textContent = currentUser.phone;
        document.getElementById('profile-gender').textContent = currentUser.gender || 'Not specified';
        document.getElementById('profile-dob').textContent = currentUser.dob || 'Not specified';
        document.getElementById('profile-occupation').textContent = currentUser.occupation;
        document.getElementById('profile-organization').textContent = currentUser.organization || 'Not specified';
        document.getElementById('profile-address').textContent = currentUser.address || 'Not specified';

        // Load profile photo
        if (currentUser.profilePhoto) {
            document.getElementById('profile-photo').src = currentUser.profilePhoto;
        }
    }

    function toggleEditMode() {
        isEditMode = !isEditMode;

        // Toggle visibility
        document.querySelectorAll('.profile-value').forEach(el => {
            el.style.display = isEditMode ? 'none' : 'block';
        });
        document.querySelectorAll('.profile-input').forEach(el => {
            el.style.display = isEditMode ? 'block' : 'none';
        });
        document.querySelector('.profile-actions').style.display = isEditMode ? 'flex' : 'none';
        document.getElementById('edit-profile-btn').style.display = isEditMode ? 'none' : 'inline-block';
        document.getElementById('upload-photo-btn').style.display = isEditMode ? 'inline-block' : 'none';

        if (isEditMode) {
            // Populate inputs
            document.getElementById('profile-name-input').value = currentUser.name;
            document.getElementById('profile-phone-input').value = currentUser.phone;
            document.getElementById('profile-gender-input').value = currentUser.gender || 'Male';
            document.getElementById('profile-dob-input').value = currentUser.dob || '';
            document.getElementById('profile-occupation-input').value = currentUser.occupation;
            document.getElementById('profile-organization-input').value = currentUser.organization || '';
            document.getElementById('profile-address-input').value = currentUser.address || '';
        }
    }

    function saveProfile() {
        const updates = {
            name: document.getElementById('profile-name-input').value,
            phone: document.getElementById('profile-phone-input').value,
            gender: document.getElementById('profile-gender-input').value,
            dob: document.getElementById('profile-dob-input').value,
            occupation: document.getElementById('profile-occupation-input').value,
            organization: document.getElementById('profile-organization-input').value,
            address: document.getElementById('profile-address-input').value
        };

        const updated = window.DB.updateUser(currentUser.id, updates);
        if (updated) {
            currentUser = updated;
            loadProfile();
            toggleEditMode();
            showMessage('profile-message', 'Profile updated successfully', 'success');
        } else {
            showMessage('profile-message', 'Failed to update profile', 'error');
        }
    }

    function cancelEdit() {
        toggleEditMode();
    }

    function handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const dataUrl = event.target.result;
            window.DB.updateUser(currentUser.id, { profilePhoto: dataUrl });
            currentUser.profilePhoto = dataUrl;
            document.getElementById('profile-photo').src = dataUrl;
            showMessage('profile-message', 'Profile photo updated', 'success');
        };
        reader.readAsDataURL(file);
    }

    function loadPaymentStatus() {
        const payment = window.DB.getPaymentByUserId(currentUser.id);
        if (payment) {
            const statusEl = document.getElementById('payment-status');
            statusEl.textContent = payment.status;
            statusEl.className = 'badge badge-' + payment.status.toLowerCase();

            document.getElementById('payment-amount').textContent = payment.amount;
            document.getElementById('payment-date').textContent = payment.date;
            document.getElementById('payment-id').textContent = payment.paymentId;
            document.getElementById('payment-method').textContent = payment.method;

            // Set receipt download link
            const receiptPath = payment.receiptPath || './receipts/mock-receipt.pdf';
            document.getElementById('download-receipt-btn').href = receiptPath;
        } else {
            document.getElementById('payment-status').textContent = 'No payment record';
        }
    }

    function loadReceiptDetails() {
        const payment = window.DB.getPaymentByUserId(currentUser.id);
        if (payment) {
            document.getElementById('receipt-number').textContent = payment.receiptNumber;
            document.getElementById('receipt-user-name').textContent = currentUser.name;
            document.getElementById('receipt-email').textContent = currentUser.email;
            document.getElementById('receipt-amount').textContent = payment.amount;
            document.getElementById('receipt-date').textContent = payment.date;
        }
    }

    function loadSubmissions() {
        const submissions = window.DB.getSubmissionsByUserId(currentUser.id);
        const tbody = document.getElementById('submissions-tbody');
        tbody.innerHTML = '';

        if (submissions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No submissions found</td></tr>';
            return;
        }

        submissions.forEach(sub => {
            const tr = document.createElement('tr');
            
            const statusClass = sub.status.toLowerCase().replace(' ', '-');
            const actionBtn = sub.status === 'Revision Required' 
                ? `<button class="btn btn-small" onclick="window.Dashboard.showReuploadModal('${sub.id}')">Re-upload</button>`
                : '-';

            tr.innerHTML = `
                <td>${sub.id}</td>
                <td>${sub.title}</td>
                <td>${sub.date}</td>
                <td><span class="badge badge-${statusClass}">${sub.status}</span></td>
                <td><a href="${sub.filePath}" target="_blank">Download</a></td>
                <td>${sub.remarks}</td>
                <td>${actionBtn}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function showReuploadModal(submissionId) {
        document.getElementById('reupload-submission-id').value = submissionId;
        document.getElementById('reupload-modal').classList.add('active');
    }

    function handleReupload(e) {
        e.preventDefault();
        const submissionId = document.getElementById('reupload-submission-id').value;
        const fileInput = document.getElementById('reupload-file');
        const file = fileInput.files[0];

        if (!file) {
            showMessage('reupload-message', 'Please select a file', 'error');
            return;
        }

        // Simulate file upload
        const newFileName = file.name;
        const updates = {
            fileName: newFileName,
            filePath: './assets/reupload-placeholder.txt',
            status: 'Under Review',
            remarks: 'Re-uploaded file under review'
        };

        const updated = window.DB.updateSubmission(submissionId, updates);
        if (updated) {
            showMessage('reupload-message', 'File re-uploaded successfully', 'success');
            setTimeout(() => {
                document.getElementById('reupload-modal').classList.remove('active');
                loadSubmissions();
            }, 1500);
        } else {
            showMessage('reupload-message', 'Failed to re-upload file', 'error');
        }
    }

    function handleChangePassword(e) {
        e.preventDefault();
        const current = document.getElementById('current-password').value;
        const newPass = document.getElementById('new-password-change').value;
        const confirm = document.getElementById('confirm-password-change').value;

        if (newPass !== confirm) {
            showMessage('change-password-message', 'New passwords do not match', 'error');
            return;
        }

        const result = window.Auth.changePassword(currentUser.id, current, newPass);
        if (result.success) {
            showMessage('change-password-message', 'Password changed successfully', 'success');
            e.target.reset();
        } else {
            showMessage('change-password-message', result.message, 'error');
        }
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
    window.Dashboard = {
        showReuploadModal
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window);
