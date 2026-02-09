# Production Deployment Guide

## Overview
This guide covers the process of promoting a reviewed build to production for the Agrigence platform.

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Set `II_URL` environment variable to your Internet Identity provider URL
  - Default: `https://identity.ic0.app`
  - For local development: `http://localhost:4943/?canisterId=...`
  - For custom deployments: Your specific II URL
- [ ] Verify all required environment variables are set in your deployment environment

### 2. Verify Build Artifacts
- [ ] Confirm the latest build has been reviewed and approved
- [ ] Ensure all tests pass locally
- [ ] Verify no console errors in browser developer tools
- [ ] Check that `process.env` shim is present in `index.html`

### 3. Content Verification
- [ ] Navigate to `/terms-and-conditions` page
- [ ] Verify Terms & Conditions content loads successfully
- [ ] Confirm content matches backend-provided text exactly (no frontend transformations)
- [ ] Check that all placeholders are properly replaced with actual values

### 4. Critical Page Checks
- [ ] Home page loads without errors
- [ ] Navigation works across all routes
- [ ] Authentication flow (login/logout) functions correctly
- [ ] Admin panel accessible for admin users
- [ ] Verify Internet Identity login works with configured `II_URL`

## Environment Variables

### Required Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `II_URL` | Internet Identity provider URL | `https://identity.ic0.app` | Yes |
| `NODE_ENV` | Node environment | `production` | No |
| `HOST_PORT` | Host port for Docker deployment | `8080` | No |

### Setting Environment Variables

**For Docker Compose:**
