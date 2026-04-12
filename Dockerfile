# Use official Python image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Copy requirements and install them
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire backend into /app
COPY backend /app

# Expose port 8080
EXPOSE 8080

# Run startup script (migrate + collectstatic + gunicorn)
RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]
