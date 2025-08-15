# Use the official Nginx image as the base image
FROM nginx:latest

WORKDIR /app
# Copy your custom HTML content into the Nginx web root directory
# Ensure 'html' directory exists in the same location as your Dockerfile and contains your static files
COPY . /usr/share/nginx/html/

# Expose port 80 (the default HTTP port for Nginx)
EXPOSE 80

# Command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
