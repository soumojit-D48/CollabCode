FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/chat-service/package*.json ./services/chat-service/

RUN npm install --workspace=services/chat-service

COPY services/chat-service ./services/chat-service
WORKDIR /app/services/chat-service

EXPOSE 3004
CMD ["npm", "run", "dev"]