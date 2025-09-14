# Real-Time Polling Backend Service

A Node.js backend service for real-time polling with WebSocket support, built with Express, PostgreSQL, Prisma ORM, and Socket.IO.

## Features

- **User Management**: Create and retrieve users with authentication
- **Poll Management**: Create and manage polls with multiple options
- **Real-Time Voting**: Cast votes with instant WebSocket updates
- **Live Results**: Real-time vote count updates for all connected clients

## Tech Stack

- Node.js & Express.js
- PostgreSQL with Prisma ORM
- Socket.IO for real-time communication
- Modular architecture with clean separation of concerns

## Database Schema

- **User**: Can create polls and vote on poll options
- **Poll**: Contains multiple options, created by users
- **PollOption**: Individual voting choices within a poll
- **Vote**: Junction table linking users to their poll option choices

## Project Structure

```
├── src/
│   ├── controllers/     # Route handlers
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── middleware/     # Custom middleware
│   ├── socket/         # WebSocket handlers
│   └── utils/          # Utility functions
├── prisma/
│   └── schema.prisma   # Database schema
├── index.js            # Application entry point
└── package.json
```

## Setup Instructions

1. **Install dependencies:**
   npm install
   

2. **Set up PostgreSQL database:**
   - Install PostgreSQL locally or use a cloud service
   - Create a database named `polling_db`

3. **Configure environment variables:**
   
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your database URL
   # Example: DATABASE_URL="postgresql://username:password@localhost:5432/polling_db?schema=public"
   

4. **Set up database schema:**
   
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   

5. **Start the server:**
   
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID

### Polls
- `POST /api/polls` - Create a new poll
- `GET /api/polls` - Get all polls
- `GET /api/polls/:id` - Get poll by ID with options and vote counts

### Voting
- `POST /api/votes` - Cast a vote (triggers real-time update)

## WebSocket Events

- `poll:join` - Join a poll room for real-time updates
- `poll:leave` - Leave a poll room
- `vote:update` - Receive real-time vote count updates