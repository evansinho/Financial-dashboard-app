# Use Node.js base image
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the application files
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "src/index.js"]
EXPOSE 5000
