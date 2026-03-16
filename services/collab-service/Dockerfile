FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/collab-service/package*.json ./services/collab-service/

RUN npm install --workspace=services/collab-service

COPY services/collab-service ./services/collab-service
WORKDIR /app/services/collab-service

EXPOSE 3003
CMD ["npm", "run", "dev"]