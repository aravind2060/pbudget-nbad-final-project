# Start with a base node image for building the frontend
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for caching and efficient docker build
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the React application and build it
COPY . .
RUN npm run build

# Use the official Node.js 20 image for the runtime
FROM node:20-alpine

# Set the working directory for the backend
WORKDIR /usr/src/app

# Copy package.json and other necessary files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built static files from the React build step
COPY --from=builder /app/build ./build

# Copy the backend code
COPY . .

# Expose the port the backend is running on
EXPOSE 3001

# Command to start the server
CMD ["node", "server.js"]
