# Specify a base image
FROM node:alpine

# Install dependencies
## Copy json package from project directory to build container
COPY ./ ./
RUN npm install



# Default command
CMD ["npm", "start"]