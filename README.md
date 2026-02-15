# Sportz API

A real-time sports commentary and match tracking API built with Node.js, Express, and WebSockets.

## 🚀 Overview

Sportz is a backend service designed to handle live sports data, providing instant updates to clients via WebSockets while maintaining a robust RESTful API for data management. It features built-in security and rate limiting to ensure reliability during high-traffic events.

## ✨ Features

- **Real-time Updates**: Live match creations and commentary broadcasts using WebSockets.
- **Robust API**: Manage matches and detailed commentary entries.
- **Security-First**: Integrated with **Arcjet** for:
  - Bot detection
  - Rate limiting (HTTP and WebSocket)
  - Shield protection against common attacks
- **Data Integrity**: strict schema validation using **Zod**.
- **Modern Stack**: Built with ES modules, Express 5, and Drizzle ORM.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express (v5)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Real-time**: ws (WebSockets)
- **Validation**: Zod
- **Security**: Arcjet

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (see `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Configure your `.env`:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ARCJET_KEY`: Your Arcjet API key
   - `PORT`: Server port (default: 5000)

### Database Setup

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate
```

### Running the App

```bash
# Development mode with watch
npm run dev

# Production mode
npm run start
```

## 📡 API Reference

### Matches
- `GET /matches` - List recent matches (supports `limit` query param)
- `POST /matches` - Create a new match

### Commentary
- `GET /matches/:id/commentary` - Get commentary for a specific match
- `POST /matches/:id/commentary` - Add a commentary entry

## 🔌 WebSocket Events

Connect to `ws://localhost:5000/ws`

### Client Messages
- `subscribe`: Subscribe to live updates for a match.
  ```json
  { "type": "subscribe", "matchId": 123 }
  ```
- `unsubscribe`: Stop receiving updates for a match.
  ```json
  { "type": "unsubscribe", "matchId": 123 }
  ```

### Server Broadcasts
- `match_create`: Sent to all connected clients when a new match is added.
- `commentary`: Sent to subscribers of a specific match when new commentary is added.

## 🛡 Security

The API uses Arcjet to protect endpoints.
- **HTTP**: Shield, Bot Detection, and a 10s sliding window rate limit.
- **WebSockets**: Shield, Bot Detection, and a 2s sliding window rate limit on connections.
