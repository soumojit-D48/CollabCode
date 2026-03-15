FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/room-service/package*.json ./services/room-service/

RUN npm install --workspace=services/room-service

COPY services/room-service ./services/room-service
WORKDIR /app/services/room-service

RUN npx prisma generate

EXPOSE 3002
CMD ["npm", "run", "dev"]