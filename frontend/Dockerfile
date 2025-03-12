# Use Node.js base image
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the project files
COPY . .

# Build the project
RUN npm run build

# Start production container
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "start"]
EXPOSE 3000
