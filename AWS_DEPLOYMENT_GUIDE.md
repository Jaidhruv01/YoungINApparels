# 🚀 YoungIN Apparels — AWS Deployment Guide

This guide walks you through deploying **YoungIN Apparels** to **Amazon Web Services (AWS)** using production-grade, multi-stage Docker containers.

---

## 🏗️ Architecture Overview

The application is structured into two lightweight, containerized services:

1. **Frontend Service** (`youngin-frontend`):
   - Multi-stage build (Node 20 Alpine &rarr; Nginx Alpine).
   - High-speed Gzip compression, HTTP security headers, and static asset caching.
   - Built-in reverse proxy routing `/api/` traffic directly to the backend.
   - Healthcheck endpoint at `/health` for AWS Load Balancers.

2. **Backend Service** (`youngin-backend`):
   - Python 3.11-slim FastAPI ASGI server running on Uvicorn.
   - Non-root user (`appuser`, UID 1001) compliant with AWS container security policies.
   - Works with SQLite by default or AWS RDS PostgreSQL (`psycopg2-binary` pre-installed).
   - Healthcheck endpoint at `/health`.

---

## 📋 Prerequisites

Before starting, ensure you have:

- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed and configured:
  ```bash
  aws configure
  ```
- Docker installed on your machine.
- Your AWS Account ID (12 digits, e.g. `123456789012`).

---

## 📦 Step 1: Push Images to Amazon ECR

Amazon Elastic Container Registry (ECR) stores your Docker images securely.

### Quick Method (Automated Script):
Run the included build-and-push script:
```bash
./aws/deploy-to-ecr.sh <YOUR_AWS_ACCOUNT_ID> ap-south-1 latest
```

### Manual Method:
```bash
# 1. Login to Amazon ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# 2. Create ECR repositories
aws ecr create-repository --repository-name youngin-backend --region ap-south-1
aws ecr create-repository --repository-name youngin-frontend --region ap-south-1

# 3. Build & tag images (using linux/amd64 for AWS compatibility)
docker build --platform linux/amd64 -t youngin-backend:latest ./backend
docker tag youngin-backend:latest <YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/youngin-backend:latest

docker build --platform linux/amd64 -t youngin-frontend:latest ./frontend
docker tag youngin-frontend:latest <YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/youngin-frontend:latest

# 4. Push to ECR
docker push <YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/youngin-backend:latest
docker push <YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/youngin-frontend:latest
```

---

## 🌐 Step 2: Choose Your Deployment Target

Select the AWS service that best fits your requirements:

| Deployment Option | Best For | Complexity | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **Option A: AWS App Runner** *(Recommended)* | Easiest setup, serverless, auto-scaling, free SSL | ⭐ Low | Pay per second used |
| **Option B: AWS ECS Fargate** | High traffic, custom ALB routing, enterprise | ⭐⭐ Medium | ~$20–$40 / month |
| **Option C: AWS EC2 + Docker Compose** | Maximum cost control, single VM | ⭐ Low | ~$8–$15 / month (t3.small) |

---

### Option A: AWS App Runner (Fastest & Simplest)

1. In the **AWS Console**, navigate to **AWS App Runner**.
2. Click **Create service**.
3. **Deploy Backend**:
   - Source: Container registry &rarr; Amazon ECR.
   - Image URI: `<YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/youngin-backend:latest`.
   - Port: `8000`.
   - Environment variables:
     - `DATABASE_URL`: `sqlite:///./youngin_apparels.db` (or AWS RDS PostgreSQL URL)
     - `ADMIN_API_KEY`: `<your-secure-admin-key>`
     - `CORS_ORIGINS`: `*`
   - Click **Create & Deploy**. App Runner will give you a default HTTPS URL (e.g. `https://xyz.ap-south-1.awsapprunner.com`).

4. **Deploy Frontend**:
   - Source: `<YOUR_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/youngin-frontend:latest`.
   - Port: `80`.
   - Click **Create & Deploy**.

---

### Option B: AWS ECS (Fargate) + Application Load Balancer

1. **Create an ECS Cluster**:
   ```bash
   aws ecs create-cluster --cluster-name youngin-cluster --region ap-south-1
   ```

2. **Register the Task Definition**:
   Open [`aws/ecs-task-definition.json`](file:///Users/jaidhruv/YoungINApparels/aws/ecs-task-definition.json), replace `<YOUR_ACCOUNT_ID>` and `<AWS_REGION>`, then run:
   ```bash
   aws ecs register-task-definition \
     --cli-input-json file://aws/ecs-task-definition.json \
     --region ap-south-1
   ```

3. **Create the Fargate Service**:
   Create a service in your ECS cluster using an Application Load Balancer (ALB) pointing port `80` to the frontend container and port `8000` to the backend container.

---

### Option C: AWS EC2 with Docker Compose (Cost-Effective)

1. Launch an **Ubuntu 24.04 LTS EC2 instance** (`t3.small` or `t4g.small`).
2. Attach an Elastic IP and configure Security Group (Inbound rules: Port `22` SSH, Port `80` HTTP, Port `443` HTTPS).
3. Connect via SSH:
   ```bash
   ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
   ```
4. Install Docker & Docker Compose:
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose-v2
   sudo usermod -aG docker ubuntu
   ```
5. Clone or upload your repository, then start the stack:
   ```bash
   docker compose up -d --build
   ```
6. Check container health:
   ```bash
   docker compose ps
   ```
7. *(Optional)* Install **Certbot / Nginx** on the host for free Let's Encrypt SSL:
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔐 Environment Variables Reference

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | `sqlite:///./youngin_apparels.db` | Database connection string (SQLite or PostgreSQL `postgresql://user:pass@host:5432/db`) |
| `ADMIN_API_KEY` | `youngin-secret-admin-key-2026` | Secret authentication key for the Atelier Admin Console |
| `CORS_ORIGINS` | `*` | Allowed CORS origins (comma-separated domains in production) |
| `VITE_API_URL` | `""` | Optional frontend API prefix (leave empty if using Nginx `/api/` reverse proxy) |

---

## 🧪 Local Container Testing

To test your Docker containers locally before deploying to AWS:

```bash
# Build and run the entire stack
docker compose up -d --build

# Verify running containers
docker compose ps

# Inspect logs
docker compose logs -f

# Stop containers
docker compose down
```

Storefront will be live at `http://localhost:80` (or `http://localhost:5173`) and API at `http://localhost:8000`.
