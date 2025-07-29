# Use the official Playwright base image
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose port
ENV PORT=10000
EXPOSE 10000

# Start server
CMD ["node", "index.js"]
