# Excalidraw Clone 🎨

A real-time collaborative drawing application inspired by Excalidraw. This project is a learning exercise focused on understanding modern full-stack architecture, real-time communication, and monorepo management.

## 🚧 Project Status

**Work In Progress** - Backend prototype complete, frontend development starting soon.

## 🎯 Project Goals

This is primarily a learning project aimed at mastering:
- Monorepo architecture with Turborepo
- Real-time WebSocket communication
- Advanced TypeScript patterns
- Database management with Prisma
- Security best practices
- Full-stack application development

## 🏗️ Architecture

### Turborepo Monorepo
- **Shared Packages**: Global packages accessible across all apps
- **Turbo Caching**: Optimized build times through intelligent caching
- **Type Safety**: Global TypeScript definitions shared across workspace

### Tech Stack

**Backend:**
- Node.js + Express
- WebSocket (ws library)
- Prisma ORM
- PostgreSQL
- JWT Authentication

**Frontend:** (Coming Soon)
- NextJS 
- TypeScript
- Canvas API

**DevOps:**
- Turborepo
- TypeScript
- Docker (planned)

## ✨ Features Implemented

### Real-time Collaboration
- [x] WebSocket server for persistent connections
- [x] Room-based collaboration (join/leave rooms)
- [x] Real-time shape and drawing data transport
- [ ] Conflict resolution for simultaneous edits

### Authentication & Security
- [x] JWT token-based authentication
- [x] HTTP server for WebSocket upgrade handshake
- [x] Cookie security (HttpOnly, Secure flags)
- [x] XSS protection
- [x] CSRF protection
- [ ] CORS configuration

### Database
- [x] Prisma schema design
- [x] Migration management
- [x] User and Room models
- [x] Many-to-many relationships for room participants

## 🔧 Key Learnings

### Turborepo & Monorepos
- How turbo caching works under the hood
- Creating and managing shared packages
- Configuring pipeline tasks and dependencies
- Optimizing build performance

### TypeScript
- Complex type definitions and generics
- Global type declarations
- Type safety across monorepo packages
- Solving intricate type errors

### WebSockets
- Real-time bidirectional communication
- Room-based architecture
- State synchronization across clients
- Connection lifecycle management

### Authentication over WebSockets
- Challenge: WebSocket protocol doesn't support headers like HTTP
- Solution: Use HTTP server for initial upgrade request
  - Client sends JWT in cookie during HTTP handshake
  - Server verifies JWT before upgrading to WebSocket
  - Authenticated user attached to WebSocket connection

### Prisma Migrations
- Schema versioning and evolution
- Generating and applying migrations
- Handling schema changes in development vs production
- Database relationship modeling

### Security
- **XSS Prevention**: Sanitizing user inputs, HttpOnly cookies
- **CSRF Protection**: Token-based validation
- **Secure Cookies**: Secure flag for HTTPS-only transmission
- **CORS**: (Upcoming) Cross-origin resource sharing policies

## 📁 Project Structure

```
excalidraw-clone/
├── apps/
│   ├── web/                 # Frontend React app (coming soon)
│   └── ws-server/           # WebSocket server
│       ├── src/
│       │   ├── index.ts     # Server entry point
│       │   └── handlers/    # WebSocket event handlers
│       └── package.json
├── packages/
│   ├── db/                  # Shared Prisma client
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── index.ts
│   ├── types/               # Shared TypeScript types
│   └── config/              # Shared configurations
├── turbo.json               # Turborepo configuration
└── package.json             # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/excalidraw-clone.git
cd excalidraw-clone
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
```
DATABASE_URL="postgresql://user:password@localhost:5432/excalidraw"
JWT_SECRET="your-super-secret-jwt-key"
PORT=8080
```

4. Run Prisma migrations
```bash
pnpm db:migrate
```

5. Start the development server
```bash
pnpm dev
```

## 🧪 WebSocket API

### Connection
```javascript
// Client connects with JWT in cookie
const ws = new WebSocket('ws://localhost:8080');
```

### Events

**Join Room**
```json
{
  "type": "join_room",
  "roomId": "room-uuid"
}
```

**Leave Room**
```json
{
  "type": "leave_room",
  "roomId": "room-uuid"
}
```

**Send Drawing Data** (Coming Soon)
```json
{
  "type": "draw",
  "roomId": "room-uuid",
  "data": {
    "shapes": [...],
    "action": "add|update|delete"
  }
}
```

## 📊 Database Schema

### User
```prisma
model User {
  id       String   @id @default(uuid())
  email    String   @unique
  name     String
  password String
  photo    String?
  rooms    Room[]   @relation("RoomParticipants")
}
```

### Room
```prisma
model Room {
  id               String   @id @default(uuid())
  name             String
  roomParticipants User[]   @relation("RoomParticipants")
  createdAt        DateTime @default(now())
}
```

## 🔮 Roadmap

- [ ] Frontend canvas implementation
- [ ] Shape rendering and manipulation
- [ ] Color picker and drawing tools
- [ ] User presence indicators
- [ ] Drawing history and undo/redo
- [ ] Export drawings (PNG, SVG)
- [ ] Collaborative cursor positions
- [ ] Room persistence and sharing
- [ ] Docker deployment setup
- [ ] Performance optimization

## 🐛 Known Issues

- [ ] WebSocket reconnection logic not implemented
- [ ] No rate limiting on WebSocket messages
- [ ] Database connection pooling needs optimization
- [ ] Type definitions need cleanup in some areas

## 📚 What I Learned

This project pushed me way outside my comfort zone. Here are the biggest takeaways:

1. **TypeScript is your friend**: Those red squiggly lines were frustrating at first, but they saved me from countless runtime errors.

2. **Monorepos are powerful**: Once you understand turbo caching and shared packages, development speed increases dramatically.

3. **WebSocket authentication is tricky**: You can't just slap a JWT in the connection. The HTTP upgrade handshake pattern is the way to go.

4. **Security matters from day one**: Implementing XSS and CSRF protection early is much easier than retrofitting it later.

5. **Real projects beat tutorials**: I learned more debugging WebSocket connections than I did from any course.

## 🤝 Contributing

This is primarily a learning project, but suggestions and feedback are welcome! Feel free to:
- Open issues for bugs or questions
- Submit PRs for improvements
- Share your own learnings

## 📝 License

MIT License - feel free to use this for your own learning!

## 🙏 Acknowledgments

- Inspired by [Excalidraw](https://excalidraw.com/)
- Built while learning from the developer community

---

**Note**: This is a work-in-progress learning project, not production-ready software. Use at your own risk!

## 📧 Contact

Feel free to reach out if you have questions or want to discuss real-time application architecture!

- GitHub: [@sakshamVerma08](https://github.com/sakshamVerma08)
- LinkedIn: [Your LinkedIn Profile]

---

⭐ If this project helps you learn, consider giving it a star!
