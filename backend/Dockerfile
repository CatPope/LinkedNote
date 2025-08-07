
# Stage 1: Build the application
FROM python:3.12-slim-bookworm AS builder

# Set working directory
WORKDIR /app

# Install poetry
RUN pip install poetry

# Copy project files
COPY pyproject.toml poetry.lock ./
COPY backend/ ./backend/

# Install dependencies
RUN poetry install --no-root --no-dev

# Stage 2: Create the final image
FROM python:3.12-slim-bookworm

# Set working directory
WORKDIR /app

# Copy installed dependencies from builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /usr/local/bin/poetry /usr/local/bin/poetry

# Copy application code
COPY backend/ ./backend/

# Expose port
EXPOSE 8000

# Run the application
CMD ["poetry", "run", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
