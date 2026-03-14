# CollabCode 🚀

> Real-time collaborative code editor — backend microservices platform

Multiple developers. One file. Live cursors. Instant sync.

---

## What is CollabCode?

CollabCode is a **production-ready backend** for a real-time collaborative code editor. Think Google Docs — but for code. Multiple users join a room, edit the same file simultaneously, see each other's cursors, and chat — all in real time.

This repo contains **only the backend**. Any frontend (React + Monaco Editor, VS Code extension, etc.) can plug into it via the documented REST and WebSocket APIs.

---

## Features

- 🔐 **JWT Authentication** — register, login, secure token-based sessions
- 🏠 **Room Management** — create rooms, invite members, assign roles (Owner / Editor / Viewer)
- ⚡ **Real-time Code Sync** — live code updates across all connected users via WebSocket
- 🖱️ **Live Cursors** — see every user's cursor position in real time with unique colors
- 💬 **Persistent Chat** — room chat with history that survives disconnects
- 📸 **Auto Snapshots** — code auto-saved every 30 seconds, never lose work
- 📦 **Horizontally Scalable** — Socket.IO Redis adapter means any number of instances

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Runtime | Node.js 20 | Non-blocking I/O — perfect for WebSocket-heavy apps |
| Language | TypeScript | Type safety across all services |
| HTTP | Express | Minimal, battle-tested |
| Real-time | Socket.IO 4 | WebSocket + Redis adapter for scaling |
| Auth | JWT + bcryptjs | Stateless auth, no DB call per request |
| Validation | Zod | Runtime type-safe request validation |
| ORM | Prisma | Type-safe PostgreSQL client |
| ODM | Mongoose | MongoDB schema + validation |
| Redis client | ioredis | Full-featured, TypeScript-ready |
| Logging | Winston | Structured, colorized logs |
| HTTP security | helmet | Secure headers in one line |
| Dev runner | tsx | Run TypeScript without build step |

---

## Architecture

```
                    ┌─────────────────────────────────┐
                    │         CLIENT (Browser)         │
                    │    React + Monaco Editor (UI)    │
                    └──────────┬──────────────┬────────┘
                               │ HTTP         │ WebSocket
                               ▼              ▼
                    ┌──────────────────────────────────┐
                    │        nginx  (port 80)           │
                    │        Reverse Proxy              │
                    └──┬──────────┬──────────┬────────┬─┘
                       │          │          │        │
               /api/auth   /api/rooms    /collab   /chat
                       │          │          │        │
            ┌──────────▼┐  ┌──────▼──┐ ┌────▼───┐ ┌──▼────────┐
            │   auth    │  │  room   │ │ collab │ │   chat    │
            │  :3001    │  │  :3002  │ │ :3003  │ │   :3004   │
            └─────┬─────┘  └────┬────┘ └────┬───┘ └─────┬─────┘
                  │             │            │            │
            ┌─────▼─────┐ ┌────▼────┐ ┌────▼────┐ ┌─────▼─────┐
            │ PostgreSQL│ │PostgreSQL│ │  Redis  │ │  MongoDB  │
            │  auth_db  │ │ room_db  │ │         │ │  chat_db  │
            └───────────┘ └─────────┘ └────┬────┘ └───────────┘
                                           │
                               ┌───────────▼──────────┐
                               │   snapshot-service   │
                               │   (background worker)│
                               │   polls Redis → disk │
                               └──────────────────────┘
```

**Golden rule: services never call each other at runtime.** They share only a JWT secret and Redis.

---

## Services

| Service | Port | DB | Description |
|---|---|---|---|
| **auth-service** | 3001 | PostgreSQL | Register, login, JWT issuance |
| **room-service** | 3002 | PostgreSQL | Room CRUD, membership, roles |
| **collab-service** | 3003 | Redis | Real-time code sync + cursors |
| **chat-service** | 3004 | MongoDB | Real-time chat + history |
| **snapshot-service** | — | Disk | Background code snapshot worker |

---

## Project Structure

```
collab-editor-v2/
│
├── package.json                     ← npm workspaces root
├── tsconfig.base.json               ← base TS config (all services extend this)
│
├── packages/
│   └── shared/                      ← @collab/shared — zero duplication
│       └── src/
│           ├── index.ts             ← single import point
│           ├── logger.ts            ← Winston logger
│           ├── jwt.ts               ← signToken / verifyToken
│           ├── types/index.ts       ← JwtPayload, AuthRequest
│           ├── errors/AppError.ts   ← AppError + subclasses
│           └── middleware/
│               ├── authenticate.ts  ← JWT HTTP middleware
│               └── errorHandler.ts  ← Express error middleware
│
├── infra/
│   ├── docker-compose.yml           ← postgres + mongo + redis
│   ├── .env.example
│   └── nginx/nginx.conf
│
├── scripts/
│   ├── install-all.sh
│   └── migrate-all.sh
│
└── services/
    ├── auth-service/
    ├── room-service/
    ├── collab-service/
    ├── chat-service/
    └── snapshot-service/
```

---

## Prerequisites

- **Node.js** v20+
- **Docker** + Docker Compose
- **npm** v9+ (workspaces support)

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/collab-editor-v2.git
cd collab-editor-v2

npm install
# One install — workspaces handles all 5 services + shared package
```

### 2. Configure environment variables

Each service has a `.env` file. The only critical rule:

> **`JWT_SECRET` must be the same value in every service**

```bash
# services/auth-service/.env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_db?schema=public"
JWT_SECRET=your_super_secret_min_32_chars_here
JWT_EXPIRES_IN=7d
NODE_ENV=development

# services/room-service/.env
PORT=3002
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/room_db?schema=public"
JWT_SECRET=your_super_secret_min_32_chars_here
NODE_ENV=development

# services/collab-service/.env
PORT=3003
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_super_secret_min_32_chars_here
NODE_ENV=development

# services/chat-service/.env
PORT=3004
MONGO_URI=mongodb://mongo:mongo@localhost:27017/chat_db?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_super_secret_min_32_chars_here
NODE_ENV=development

# services/snapshot-service/.env
REDIS_HOST=localhost
REDIS_PORT=6379
SNAPSHOT_DIR=./snapshots
SNAPSHOT_INTERVAL_MS=30000
NODE_ENV=development
```

### 3. Start infrastructure

```bash
cd infra
docker compose up -d

# Wait until all 3 containers are healthy
docker compose ps
```

Expected output:
```
NAME          STATUS
ce_postgres   running (healthy)
ce_mongo      running (healthy)
ce_redis      running (healthy)
```

### 4. Run database migrations

```bash
cd services/auth-service
npx prisma migrate dev --name init

cd ../room-service
npx prisma migrate dev --name init
```

### 5. Start all services

Open 5 terminals (or use a process manager like `pm2`):

```bash
# Terminal 1
npm run dev:auth

# Terminal 2
npm run dev:room

# Terminal 3
npm run dev:collab

# Terminal 4
npm run dev:chat

# Terminal 5
npm run dev:snapshot
```

### 6. Verify everything is running

```bash
curl http://localhost:3001/health
# {"status":"ok","service":"auth-service"}

curl http://localhost:3002/health
# {"status":"ok","service":"room-service"}

curl http://localhost:3003/health
# {"status":"ok","service":"collab-service"}

curl http://localhost:3004/health
# {"status":"ok","service":"chat-service"}
```

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| `JWT_SECRET is not set` | Missing env var | Add `JWT_SECRET` to the service `.env` |
| `connect ECONNREFUSED 5432` | PostgreSQL not running | Run `docker compose up -d` from `infra/` |
| `connect ECONNREFUSED 6379` | Redis not running | Run `docker compose up -d` from `infra/` |
| `Authentication required` on WebSocket | No token passed | Pass `auth: { token }` in socket.io connect options |
| `409 Email is already taken` | Duplicate registration | Use a different email or login instead |
| `403 Only the owner can...` | Wrong role | Action requires OWNER role |
| Prisma: `Table does not exist` | Migrations not run | Run `npx prisma migrate dev --name init` in the service folder |

---

## Production Checklist

- [ ] Change all `.env` `JWT_SECRET` values to a strong random 32+ char string
- [ ] Change Docker DB passwords from `postgres`/`mongo` defaults
- [ ] Set `NODE_ENV=production` in all services
- [ ] Add rate limiting (express-rate-limit) to auth and room services
- [ ] Restrict CORS origins — replace `origin: '*'` with actual frontend domain
- [ ] Replace snapshot disk writes with S3 (`snapshot.storage.ts`)
- [ ] Add HTTPS / TLS termination at nginx
- [ ] Set up log aggregation (Datadog, Loki, etc.)
- [ ] Uncomment services in `docker-compose.yml` and test full Docker deploy

---

## Contributing

1. Fork the repo
2. Create a feature branch — `git checkout -b feature/my-feature`
3. Make your changes
4. Run `npm install` from root to ensure workspace links are intact
5. Open a pull request

---

## License

MIT

---

*Built with Node.js · TypeScript · Express · Socket.IO · Prisma · Mongoose · Redis · PostgreSQL · MongoDB*