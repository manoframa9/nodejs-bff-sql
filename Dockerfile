# Specify the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that your server listens on (replace 3000 with your desired port)
EXPOSE 3000

# Start the server
CMD [ "node", "server.js" ]
