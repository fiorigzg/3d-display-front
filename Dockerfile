# Use the official Node.js 16 image as a base
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application for production
RUN npm run build

# Use a minimal Node.js image to run the application
FROM node:20-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=base /app/.next /app/.next
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/package.json /app/package.json
COPY --from=base /app/public /app/public

# Expose the port on which Next.js runs
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]
