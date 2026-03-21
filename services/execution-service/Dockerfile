FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/execution-service/package*.json ./services/execution-service/

RUN npm install --workspace=services/execution-service

COPY services/execution-service ./services/execution-service
WORKDIR /app/services/execution-service

EXPOSE 3005
CMD ["npm", "run", "dev"]