# Specify a base image
FROM node:alpine

# Add a Working directory to copy dependencies and files so the image's original files won't get overriden

WORKDIR /usr/app

# Install dependencies
## Copy json package from project directory to build container
COPY ./package.json ./
RUN npm install
COPY ./ ./


# Default command
CMD ["npm", "start"]