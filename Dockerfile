# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

# Build the app
RUN yarn build

# Generate Prisma Client
RUN yarn prisma:generate

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["yarn", "start:prod"]