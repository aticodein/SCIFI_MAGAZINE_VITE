# Use official Python image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ .

# Set work directory to backend
WORKDIR /app

# Expose port 8080
EXPOSE 8080

# Run Gunicorn
CMD ["gunicorn", "sci_fi_magazine.wsgi:application", "--bind", "0.0.0.0:8080"]
