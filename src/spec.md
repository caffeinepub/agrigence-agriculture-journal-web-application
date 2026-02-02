# Agrigence Agriculture Journal Web Application

## Overview
Agrigence is a professional agriculture journal publication platform that enables members to submit research articles and administrators to manage journal publications. The application features subscription-based access, article submission workflows, journal archive management, and editorial board information with a clean Indian agriculture theme.

## User Roles

### Admin
- Login using email and password authentication with default testing credentials (Email: Shivesh@cv, Password: Shivika@143)
- Access dedicated Admin Panel interface through profile menu
- Manage news and updates (add, edit, delete) via Admin Panel
- Upload monthly journal PDFs with metadata (month/year) via Admin Panel
- Review submitted articles from users
- Approve or reject article submissions
- Manage editorial board member information through Editorial Board Manager
- Configure Stripe payment gateway settings (secret/public keys, allowed countries)

### Member/User
- Create account through registration with name, email, phone, occupation, password, and confirm password
- Login using email and password authentication
- Reset password through forgot password workflow
- Create profile with name, email, phone, and occupation
- Purchase subscriptions through Stripe integration with hosted checkout
- Submit research articles (PDF/DOC files)
- View submission history and subscription status
- Cancel subscription if no articles have been submitted

## Authentication System

### Registration Page
- Form fields for name, email, phone, occupation, password, and confirm password
- Password validation and confirmation matching
- Account creation with secure password hashing
- Redirect to login page after successful registration

### Login Page
- Email and password input fields
- Submit button for authentication
- "Forgot Password?" link
- "Create New Account" link to registration page
- Redirect to dashboard after successful login

### Forgot Password Page
- Password reset workflow allowing users to securely reset their password
- Email-based password reset or security question recovery
- Secure token generation and validation

### Profile Dashboard Integration
- Immediate subscription status check after login
- For users without active subscription: prominent "Buy Subscription" button linking to subscription page
- For users with active subscription: display current plan details including plan name, expiry date, and remaining article count

## Subscription Plans
The application offers four subscription tiers processed through Stripe:
1. ₹149 — 1 Article submission
2. ₹499 — 10 Articles (valid 12 months)
3. ₹1499 — Unlimited Articles (2 years)
4. ₹4999 — Institute plan (1 year, unlimited)

Subscription rules:
- Login required before purchase
- Cancellation allowed only if no articles have been submitted
- Subscription status updates in backend after successful payment verification

## Core Features

### Global Header
- Profile icon dropdown menu in top-right corner with dynamic options based on login state:
  - For logged-out users: Login, Create Account
  - For logged-in users: View Profile, View Portfolio, Logout
  - For admin users: additional Admin Panel option
- Site-wide search bar for finding articles by title, author name, and keywords using React Query integration with backend's getAllArticles query

### Global Footer
- Submission deadline text (countdown timer to 25th of each month at 11:59 PM with auto-reset)
- Live visitor counter visible on all pages
- Social media links (X, Instagram, Facebook, YouTube, LinkedIn)

### Home Page
- Hero section with prominent tagline "Join the leading platform for agricultural research and journal publication" displayed with:
  - Large, legible typography with appropriate spacing
  - Contrasting color (bright white or deep green depending on background)
  - Fade-in animation consistent with agriculture theme
  - Responsive design for mobile and desktop displays
- News and Updates section displaying recent news from backend with title, date, and short description in scrolling format with "Read More" links
- Latest Magazine section displaying recent magazines in responsive grid layout with:
  - Magazine cards showing cover image, title, issue, short tagline/summary
  - "View Magazine" button linking to journals page
  - "Download PDF" button for direct download
  - Fade-in and slide-up animations consistent with site theme
  - Indian agriculture color theme (Dark Green #1B5E20, White, Grey)
- Articles Preview section displaying 3 sample articles in responsive three-column card grid layout:
  - Article titles: "Role of AI in Modern Agriculture", "Improving Soil Fertility Naturally", "Water Management Practices for Farmers"
  - Each card shows title, short placeholder description (2-3 lines), and "Read More" button
  - Visual styling with Dark Green (#1B5E20) for headings and buttons, White background (#FFFFFF), Light Grey (#F5F5F5) card backgrounds, Dark Grey text (#333333)
  - Soft hover animation on cards and smooth fade-in animation on scroll
  - Responsive design that stacks cards on mobile devices
- One featured magazine card showcasing the most recent journal with cover image, title, volume/issue info, description, and View/Download buttons
- One featured article card displaying latest article with title, author, and submission date in clean card layout with hover animation
- User Reviews section positioned toward the bottom of the home page displaying 3-5 user testimonials in responsive card/grid layout with reviewer name, photo (optional), star rating icons, and short feedback text with fade-in animations

### Editorial Board Page
- Header titled "Editorial Board" with introductory paragraph explaining the board's purpose
- Responsive grid layout displaying editorial members in card format
- Each member card shows profile photo, name, designation/role, qualification, area of expertise, and optional contact/email
- Academic, professional design consistent with site's color palette and typography
- Default sample editorial board members with realistic academic-style data including full names, designations (Editor-in-Chief, Associate Editor, Reviewer), qualifications, areas of expertise, and optional email addresses
- All sample members use "Zura Haradhan, Chandauli, Uttar Pradesh, 221115" as institutional location

### Author Guidelines Page
- Comprehensive article formatting requirements including:
  - Font: Times New Roman, 12pt
  - Line spacing: 1.5
  - Margins: 1 inch all sides
  - File type: PDF or DOC only
  - Required sections: title page, abstract, introduction, methodology, results, discussion, references
  - Citation format: APA/IEEE style
  - Submission limits based on subscription tier
  - Contact support via WhatsApp: +91 9452571317
- Professional academic layout consistent with site design

### News and Updates
- Dynamic display of news managed by admin
- Chronological listing of announcements

### Journals/Archive
- Current journal issue display
- Archive browsing by month and year
- PDF viewing and download functionality

### Article Submission
- File upload for PDF/DOC documents
- Subscription validation before upload
- Submission tracking and status updates

### User Dashboard
- Profile information display
- Active subscription details and expiry date with highlighted status
- Subscription status-based UI:
  - No active subscription: prominent "Buy Subscription" button
  - Active subscription: plan details (name, expiry, remaining articles)
- List of submitted articles with status
- New article submission access

### Admin Panel
- Dedicated admin interface accessible only to admin users via role-based access control
- Tabbed interface with three main sections:
  1. **Publish Magazine Tab**:
     - Upload new magazine PDFs with metadata fields (title, month/year, description, file size)
     - Toggle between current/archive status
     - Auto-display latest magazine on homepage as featured issue
     - Integration with existing `uploadJournal` backend endpoint
  2. **Publish News Tab**:
     - Add new news items with title, summary, and full content
     - Edit existing news entries
     - Delete news items with confirmation
     - Preview news display for homepage and News & Updates page
     - Integration with existing `addNews` and `deleteNews` backend endpoints
  3. **Editorial Board Manager Tab**:
     - Add new editorial board members with fields for Photo, Name, Designation, and Description
     - Edit existing member details (Photo, Name, Designation, Description) inline or via modal edit dialog
     - Remove existing members from the list with confirmation modal
     - Display current editorial board members in a responsive grid layout
     - Success notifications for all operations (add, edit, remove)
     - Smooth transitions and animations consistent with site theme
     - Integration with backend endpoints for editorial member management
- Agricultural-themed design with clean card layouts, green/brown color palette
- Responsive design with clean input fields and form validation
- Success/error feedback for all operations
- Navigation accessible through profile dropdown menu for admin users

### About & Contact Page (Merged)
- Combined page at `/about-contact` route
- Founder and Co-Founder images and details (Sarvesh Kumar Yadav and Shivi Jaiswal)
- Contact form for messages
- Contact information: phone (+91 9452571317), WhatsApp (+91 9452571317), email (agrigence@gmail.com)
- Clean grid-based responsive layout

### Subscription & Payment Flow
- Subscription page with four subscription plan cards
- Each subscription card connects to Stripe checkout session creation
- Redirect to Stripe hosted checkout page for secure payment processing
- Payment success redirects to dedicated success page with subscription activation confirmation
- Payment failure redirects to dedicated failure page with retry options
- Loading states and error handling throughout payment process
- Visual feedback for pending transactions

### Payment Result Pages
- Payment Success Page: confirms subscription activation and redirects to user dashboard
- Payment Failure Page: displays error message with retry payment options

## Pages Structure
- Home page with news section, latest magazine section, articles preview section, featured magazine card, featured article card, and user reviews section
- Login page with email/password authentication
- Registration page with user account creation
- Forgot Password page with password reset workflow
- Editorial Board page with member grid
- Author Guidelines page with detailed formatting requirements
- News and Updates page (renamed from Notice Board)
- Journals/Archive page
- Article Submission page (members only)
- User Dashboard (members only) with subscription status integration
- Admin Panel at /admin route (admin only)
- Subscription page with Stripe integration
- Payment Success page
- Payment Failure page
- About & Contact page (merged) at `/about-contact`

## Backend Data Storage
The backend must store:
- User profiles with hashed passwords and authentication data
- User registration and login verification systems
- Password reset tokens and security question data
- Subscription information and status
- Article submissions with metadata and approval status
- News and updates content (renamed from notices)
- Journal PDFs with associated metadata
- Editorial board member information (name, designation, qualification, expertise, contact details, profile photos)
- Sample editorial board members data with realistic academic information
- Payment transaction records and Stripe session data
- Admin login credentials for testing access
- Visitor counter data
- Contact form submissions
- Stripe configuration settings (secret key, public key, allowed countries)
- User session management data
- Sample content data including 3 news posts with agricultural reporting style titles and dates
- Sample magazine data with 2-3 magazines including metadata and descriptions
- Sample article data with 2-3 articles including title, author, and description snippets
- User review testimonials with reviewer name, rating, and feedback text
- Latest magazine data including:
  - "Agrigence Monthly – January 2026 Edition"
  - "Modern Farming Methods – Special Issue"
  - "Soil Health & Crop Productivity Guide"
  - Each with title, issue information, short tagline/summary, and cover image references
- Articles preview data including:
  - "Role of AI in Modern Agriculture" with placeholder description
  - "Improving Soil Fertility Naturally" with placeholder description
  - "Water Management Practices for Farmers" with placeholder description

## Backend Authentication Integration
The backend must provide:
- User registration with secure password hashing
- Email and password login verification
- Session management and authentication tokens
- Password reset functionality with secure token generation
- User profile management and updates
- Subscription status checking for authenticated users
- Role-based access control for admin and member functions

## Backend Payment Integration
The backend must provide:
- `createCheckoutSession` function to initiate Stripe payment sessions for subscription plans
- `getStripeSessionStatus` function to verify payment completion and activate subscriptions
- `setStripeConfiguration` function for admin to configure Stripe credentials
- Role-based access control for payment functions (admin for configuration, authenticated users for purchases)
- Automatic subscription activation upon successful payment verification

## Backend Editorial Board Management
The backend must provide:
- `addEditorialMember` function to add new editorial board members with photo, name, designation, and description
- `updateEditorialMember` function to edit existing member details
- `removeEditorialMember` function to delete members from the editorial board
- `getEditorialMembers` function to retrieve all editorial board members
- Role-based access control ensuring only admin users can manage editorial board members
- Proper validation for all editorial member data fields

## Search Functionality
- Backend must provide getAllArticles query that returns articles with title, author name, and keywords for search functionality
- Search results must be filterable by title, author name, and keywords

## Design & Animation Requirements
- Indian agriculture theme with natural color palette (greens, soil browns, sky tones)
- Professional typography with enhanced color contrast for readability across light/dark themes
- Harmonized section fonts and spacing for cohesive visual hierarchy
- Lightweight CSS and Framer Motion animations:
  - Fade-in on page load
  - Slide-up on scroll
  - Hover effects for cards and buttons
  - Hero tagline fade-in animation for visual prominence
  - User reviews section fade-in animations
  - Latest magazine section fade-in and slide-up animations
  - Articles preview section fade-in animations and soft hover effects on cards
- Custom loading animation featuring a plant growing from soil with refined animation sequence:
  - Soil appears first with fade-in at the bottom
  - A seed drops into the soil
  - A sprout emerges, growing into a small plant with smooth transitions
  - Website content loads immediately after animation finishes
  - Colors aligned with Agrigence color scheme (dark green, soil brown, light sky tones)
  - Seamless transition into main site
  - Performance optimized to prevent page load delays
  - Responsive design for all screen sizes
  - Used during initial app loading on all pages
- Minimal, modern, responsive layout with soft shadows and rounded cards
- Consistent typography and spacing across pages
- Performance optimized animations for mobile devices
- Clear call-to-action buttons for payment flows
- Loading spinners and error states for payment processing
- Admin Panel styled with agricultural aesthetic matching site design
- Hero section tagline styling with contrasting colors and large typography for maximum visibility
- Authentication pages styled consistently with agriculture theme
- Latest magazine section styled with Dark Green (#1B5E20), White, and Grey color scheme
- Articles preview section styled with Dark Green (#1B5E20) for headings and buttons, White background (#FFFFFF), Light Grey (#F5F5F5) card backgrounds, Dark Grey text (#333333)
- Editorial Board Manager section styled with consistent agricultural theme, smooth transitions, and professional card layouts

## Technical Requirements
- Email and password authentication system with secure password hashing
- User registration and login workflows
- Password reset functionality
- Role-based access control for admin and member functions
- File upload and blob storage for PDFs and documents
- Stripe payment processing integration with hosted checkout
- Subscription validation logic
- Visitor counter functionality with persistent storage
- Responsive design with agriculture-themed styling
- Card-based layouts for editorial members, news, magazine sections, articles preview, articles, and user reviews
- Academic/professional design consistency across all pages
- Main navigation menu with updated labels (News instead of Notice Board)
- React Query integration for search functionality
- Secure payment flow with proper error handling and user feedback
- Admin Panel integration with existing backend endpoints and authorization
- Dynamic profile menu based on authentication state
- Latest magazine section with responsive grid layout and consistent card design
- Articles preview section with responsive three-column grid layout that stacks on mobile
- Custom LoadingScreen component with plant growth animation using CSS animations or lightweight SVG animation
- Editorial Board Manager with confirmation modals for deletion, success notifications, and smooth transitions

## Authentication & Authorization
- Email and password authentication system
- User registration with account creation
- Password reset and recovery workflows
- Role-based access control distinguishing admin and member capabilities
- Session management for authenticated users
- Default admin testing credentials configured in backend
- Payment functions secured with appropriate role validation
- Admin Panel access restricted to admin users only
- Subscription status checking integrated with user dashboard
- Editorial Board Manager access restricted to admin users only
