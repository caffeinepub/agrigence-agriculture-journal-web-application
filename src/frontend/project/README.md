# Journal Portal - Offline Mini-App

A complete offline-ready journal submission and publication management system built with pure HTML, CSS, and JavaScript.

## Features

### Authentication System
- **User Registration**: Create new accounts with comprehensive profile information
- **Login**: Secure session simulation using localStorage
- **Forgot Password**: Reset password using email, phone, date of birth, and occupation verification (no OTP required)
- **Session Management**: Automatic redirection based on authentication state

### User Dashboard
Users can access the following features after logging in:

#### My Profile
- View and edit personal information
- Upload profile photo (stored as data URL in localStorage)
- Fields: Name, Email (read-only), Phone, Gender, Date of Birth, Occupation, Organization, Address

#### Payment Status
- View payment status (Pending/Paid/Failed)
- Display amount, date, payment ID, and method
- Download receipt (PDF mock file)

#### Receipt System
- View receipt details including receipt number, user details, and payment information

#### Submissions
- View all submissions in a table format
- Columns: Submission ID, Title, Date, Status, Download File, Admin Remarks, Action
- Download submitted files
- Re-upload files when status is "Revision Required"

#### Change Password
- Change password with current password verification
- New password confirmation

### Admin Panel
Administrators have access to:

#### User Management
- Search and view all users
- View complete user profiles including profile photos

#### Payment Management
- Update payment status and details for any user
- Set custom receipt paths
- Manage payment records

#### Submission Management
- View all user submissions
- Update submission status (Under Review/Accepted/Rejected/Revision Required)
- Add or edit admin remarks

#### Password Reset
- Manually reset passwords for any user

## How to Use

### Opening the Application
1. Navigate to the `/frontend/project` directory
2. Double-click `index.html` to open in your browser
3. The application works completely offline using file:// protocol

### Default Accounts

**Admin Account:**
- Email: admin@journal.com
- Password: admin123

**User Account:**
- Email: john@example.com
- Password: user123

### Testing Flows

#### User Flow:
1. Open `index.html`
2. Login with user credentials or create a new account
3. View dashboard with profile, payment, and submission information
4. Edit profile and upload photo
5. Change password
6. Re-upload files for submissions requiring revision

#### Admin Flow:
1. Open `index.html`
2. Login with admin credentials
3. Access admin panel
4. Search and select users
5. Update payment status and details
6. Manage submissions and add remarks
7. Reset user passwords

## Folder Structure

