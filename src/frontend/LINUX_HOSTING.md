# Linux Hosting Guide for Agrigence Frontend

This guide provides step-by-step instructions for deploying the Agrigence Vite React SPA on Linux servers using Docker or direct Nginx hosting.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Option 1: Docker Deployment](#option-1-docker-deployment)
3. [Option 2: Docker Compose Deployment](#option-2-docker-compose-deployment)
4. [Option 3: Direct Nginx Deployment](#option-3-direct-nginx-deployment)
5. [Backend Configuration](#backend-configuration)
6. [Verification Checklist](#verification-checklist)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- Linux server (Ubuntu 20.04+, Debian 11+, CentOS 8+, or similar)
- Minimum 1GB RAM, 10GB disk space
- Root or sudo access

### Software Requirements

**For Docker deployments:**
- Docker 20.10+ ([Install Docker](https://docs.docker.com/engine/install/))
- Docker Compose 2.0+ (included with Docker Desktop, or install separately)

**For direct Nginx deployment:**
- Node.js 20+ and pnpm ([Install Node.js](https://nodejs.org/))
- Nginx 1.18+ ([Install Nginx](https://nginx.org/en/docs/install.html))

---

## Option 1: Docker Deployment

### Step 1: Clone Repository
