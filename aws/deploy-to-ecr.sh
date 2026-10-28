#!/usr/bin/env bash
# ==============================================================================
# AWS ECR Build & Push Automation Script for YoungIN Apparels
# Usage:
#   chmod +x aws/deploy-to-ecr.sh
#   ./aws/deploy-to-ecr.sh <AWS_ACCOUNT_ID> [AWS_REGION] [IMAGE_TAG]
# Example:
#   ./aws/deploy-to-ecr.sh 123456789012 ap-south-1 v1.0.0
# ==============================================================================

set -e

AWS_ACCOUNT_ID=$1
AWS_REGION=${2:-"ap-south-1"} # Default: Mumbai region
IMAGE_TAG=${3:-"latest"}

if [ -z "$AWS_ACCOUNT_ID" ]; then
  echo "❌ Error: AWS Account ID is required."
  echo "Usage: ./aws/deploy-to-ecr.sh <AWS_ACCOUNT_ID> [AWS_REGION] [IMAGE_TAG]"
  exit 1
fi

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
BACKEND_REPO="youngin-backend"
FRONTEND_REPO="youngin-frontend"

echo "=========================================================="
echo "🚀 YoungIN Apparels AWS ECR Deployment"
echo "   Account:  $AWS_ACCOUNT_ID"
echo "   Region:   $AWS_REGION"
echo "   Tag:      $IMAGE_TAG"
echo "   Registry: $ECR_REGISTRY"
echo "=========================================================="

# 1. Authenticate Docker with Amazon ECR
echo ""
echo "🔑 1/5 Authenticating Docker with Amazon ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"

# 2. Ensure ECR repositories exist
echo ""
echo "📦 2/5 Ensuring ECR repositories exist..."
aws ecr describe-repositories --repository-names "$BACKEND_REPO" --region "$AWS_REGION" >/dev/null 2>&1 || \
  aws ecr create-repository --repository-name "$BACKEND_REPO" --region "$AWS_REGION" --image-scanning-configuration scanOnPush=true

aws ecr describe-repositories --repository-names "$FRONTEND_REPO" --region "$AWS_REGION" >/dev/null 2>&1 || \
  aws ecr create-repository --repository-name "$FRONTEND_REPO" --region "$AWS_REGION" --image-scanning-configuration scanOnPush=true

# 3. Build Docker images (for linux/amd64 target to ensure compatibility with AWS ECS / Fargate)
echo ""
echo "🏗️  3/5 Building Backend Docker image..."
docker build --platform linux/amd64 -t "${BACKEND_REPO}:${IMAGE_TAG}" -t "${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG}" ./backend

echo ""
echo "🏗️  4/5 Building Frontend Docker image..."
docker build --platform linux/amd64 -t "${FRONTEND_REPO}:${IMAGE_TAG}" -t "${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}" ./frontend

# 4. Push Docker images to ECR
echo ""
echo "⬆️  5/5 Pushing images to Amazon ECR..."
docker push "${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG}"
docker push "${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}"

echo ""
echo "=========================================================="
echo "✅ Deployment images pushed successfully to Amazon ECR!"
echo "   Backend:  ${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG}"
echo "   Frontend: ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}"
echo "=========================================================="
