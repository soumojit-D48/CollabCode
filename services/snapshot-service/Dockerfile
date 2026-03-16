FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/snapshot-service/package*.json ./services/snapshot-service/

RUN npm install --workspace=services/snapshot-service

COPY services/snapshot-service ./services/snapshot-service
WORKDIR /app/services/snapshot-service

RUN mkdir -p snapshots

CMD ["npm", "run", "dev"]