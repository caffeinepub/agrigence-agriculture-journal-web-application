# Production Deployment Guide

## Overview
This guide covers the process of promoting a reviewed build to production for the Agrigence platform.

## Pre-Deployment Checklist

### 1. Verify Build Artifacts
- [ ] Confirm the latest build (Version 30) has been reviewed and approved
- [ ] Ensure all tests pass locally
- [ ] Verify no console errors in browser developer tools

### 2. Content Verification
- [ ] Navigate to `/terms-and-conditions` page
- [ ] Verify Terms & Conditions content loads successfully
- [ ] Confirm content matches backend-provided text exactly (no frontend transformations)
- [ ] Check that all placeholders are properly replaced with actual values

### 3. Critical Page Checks
- [ ] Home page loads without errors
- [ ] Navigation works across all routes
- [ ] Authentication flow (login/logout) functions correctly
- [ ] Admin panel accessible for admin users

## Deployment Steps

### 1. Build Frontend
