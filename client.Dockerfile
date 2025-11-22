FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# Copy client code only
COPY src/client ./client

EXPOSE 4000

CMD ["node", "client/index.js"]
