# Use the official Node.js image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including playwright)
RUN npm install && \
    npx playwright install --with-deps

# Copy the rest of the code
COPY . .

# Expose port
ENV PORT=10000
EXPOSE 10000

# Start the server
CMD ["node", "index.js"]
