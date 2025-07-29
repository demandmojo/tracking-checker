# Use the official Node.js image
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose port
ENV PORT=10000
EXPOSE 10000

# Start server
CMD ["node", "index.js"]
