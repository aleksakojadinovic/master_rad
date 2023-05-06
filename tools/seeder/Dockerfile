FROM node:18-alpine3.16

# Basic setup
WORKDIR /app
ENV NODE_ENV=development

# Install dependencies first to utilize build cache
COPY package*.json ./
RUN npm install

# Copy the sourcecode
COPY . .

# Start the development server
CMD ["sleep", "infinity"]
