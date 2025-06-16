FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Create virtual environment and install dependencies
RUN uv venv
RUN uv sync --frozen --no-dev

# Copy project
COPY . .

# Collect static files using the virtual environment
RUN uv run python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

CMD ["uv", "run", "gunicorn","--bind",":8000","--workers","2","api.wsgi"]