# Use the official Playwright image with all dependencies
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Set port
ENV PORT=10000
EXPOSE 10000

# Start server
CMD ["node", "index.js"]
