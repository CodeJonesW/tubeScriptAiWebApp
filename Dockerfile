# Stage 1: Build the React app
FROM node:18-alpine AS build-stage

# Set the working directory inside the container
WORKDIR /tubescript_frontend

# Copy package.json and yarn.lock (or package-lock.json if you're using npm)
COPY package*.json ./

# Install the dependencies
RUN yarn install

# Copy the rest of the application code into the container
COPY . .

# Build the frontend assets
RUN yarn build

# Stage 2: Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the build output to Nginx's default public directory
COPY --from=build-stage /tubescript_frontend/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
