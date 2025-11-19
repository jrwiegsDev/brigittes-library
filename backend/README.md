# Brigitte's Library - Backend API

Backend API for Brigitte's Library built with Node.js, Express, and MongoDB.

## Features

- ✅ JWT Authentication with refresh tokens
- ✅ User management (admin/super-admin roles)
- ✅ Book CRUD with search/filter capabilities
- ✅ Open Library API integration for book data
- ✅ Blog post management with TipTap JSON storage
- ✅ Like/heart functionality for blog posts
- ✅ Comprehensive input validation
- ✅ Rate limiting on all endpoints
- ✅ Security middleware (Helmet, CORS, NoSQL injection prevention)
- ✅ Full test suite with Jest + Supertest

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (jsonwebtoken + bcryptjs)
- **Validation:** express-validator
- **Testing:** Jest + Supertest
- **Security:** helmet, cors, express-rate-limit, express-mongo-sanitize

## Setup

### Prerequisites

- Node.js v18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string and JWT secrets:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:5173
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

### Running Tests

**Watch mode:**
```bash
npm test
```

**CI mode:**
```bash
npm run test:ci
```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/login` | Public | Login user |
| POST | `/refresh` | Public | Refresh access token |
| POST | `/register` | Private (Super Admin) | Create new admin user |
| GET | `/me` | Private | Get current user |

### Books (`/api/books`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all books (with search/filter) |
| GET | `/:id` | Public | Get single book |
| GET | `/api/search` | Private | Search Open Library API |
| POST | `/` | Private | Create new book |
| PUT | `/:id` | Private | Update book |
| DELETE | `/:id` | Private | Delete book |

**Query Parameters for GET /books:**
- `search` - Full-text search on title/author
- `genre` - Filter by genre
- `author` - Filter by author
- `minRating` / `maxRating` - Filter by Brigitte's rating
- `sort` - Sort field (default: `-createdAt`)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20, max: 100)

### Blog Posts (`/api/posts`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get published posts |
| GET | `/:slug` | Public | Get single post by slug |
| POST | `/:id/like` | Public (Rate Limited) | Like a post |
| GET | `/admin/all` | Private | Get all posts (including drafts) |
| GET | `/admin/:id` | Private | Get post by ID |
| POST | `/` | Private | Create new post |
| PUT | `/:id` | Private | Update post |
| DELETE | `/:id` | Private | Delete post |

**Query Parameters:**
- `tag` - Filter by tag
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10, max: 100)

## Rate Limiting

- **Auth endpoints:** 5 requests / 15 minutes per IP
- **Like button:** 10 requests / hour per IP
- **General API:** 100 requests / 15 minutes per IP

## Security Features

1. **Authentication:**
   - Passwords hashed with bcrypt (12 rounds)
   - JWT access tokens (15 min expiration)
   - Refresh tokens (7 day expiration)

2. **Input Validation:**
   - All endpoints use express-validator
   - XSS protection via sanitization
   - NoSQL injection prevention

3. **Headers & CORS:**
   - Helmet for security headers
   - CORS restricted to frontend URL

4. **Rate Limiting:**
   - All routes protected against abuse
   - Stricter limits on auth and like endpoints

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth, validation, error handling, rate limiting
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── controllers/     # Route handlers
│   ├── utils/           # Helper functions (JWT, Open Library API)
│   ├── tests/           # Jest test files
│   └── app.js           # Express app setup
├── server.js            # Entry point
├── package.json
├── .env.example
└── README.md
```

## Creating the First Super Admin

Once the server is running and connected to MongoDB, you'll need to manually create the first super admin user in the database or use a script. Here's a quick script you can run:

```javascript
// createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const createSuperAdmin = async () => {
  await connectDB();
  
  const user = await User.create({
    username: 'your-username',
    email: 'your-email@example.com',
    password: 'YourSecurePassword123',
    role: 'super-admin'
  });
  
  console.log('Super admin created:', user.username);
  process.exit(0);
};

createSuperAdmin();
```

Run with: `node createAdmin.js`

## Deployment

See main project README for Render deployment instructions.

## License

ISC
