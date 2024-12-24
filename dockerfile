# Use a lightweight Node.js base image
FROM node:16-slim

# Set the base working directory
WORKDIR /app

# Install necessary dependencies (if required)
RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*

# Download and set up the MovieServer source code
RUN curl -L https://github.com/A-Star100/MovieServer/archive/refs/heads/main.zip -o /tmp/source.zip \
    && unzip -q /tmp/source.zip -d /tmp \
    && mv /tmp/MovieServer-main /app/MovieServer \
    && rm -rf /tmp/*

# Set the working directory to the 'server' directory within the installation directory
WORKDIR /app/MovieServer/server

# Expose the necessary ports
EXPOSE 8080 8000 4443 3000

# Run the server
CMD ["node", "server.js"]
