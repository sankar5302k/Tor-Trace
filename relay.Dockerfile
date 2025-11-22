FROM node:18

# Set working directory
WORKDIR /app

# Copy shared package.json
COPY package.json package-lock.json* ./
RUN npm install

# Copy only relay code
COPY src/relay ./relay

# Expose the port used by relay nodes
EXPOSE 3000

CMD ["node", "relay/index.js"]
