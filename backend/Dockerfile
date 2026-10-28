# ==============================================================================
# Multi-stage Dockerfile for YoungIN Apparels FastAPI Backend (Production / AWS)
# ==============================================================================

# Stage 1: Build & Dependency Wheel Stage
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies for C extensions (e.g., psycopg2, uvicorn cython extensions)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Minimal Production Runtime
FROM python:3.11-slim AS runtime

WORKDIR /app

# Install minimal runtime libraries (curl for healthcheck, libpq5 for PostgreSQL)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder stage
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Create non-root system user for AWS security best practices
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --gid 1001 appuser

# Copy application code
COPY . .

# Ensure app directory permissions for appuser (needed for SQLite file writes and media caching)
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# AWS Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Launch uvicorn ASGI production server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
