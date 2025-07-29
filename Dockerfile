# Use the official Playwright image with all dependencies
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Set port and expose it
ENV PORT=10000
EXPOSE 10000

# Start the server
CMD ["node", "index.js"]
