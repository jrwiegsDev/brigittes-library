# Brigitte's Library - Project Plan

## Overview
A full-stack blog and personal library management system for Brigitte. Public visitors can browse her 1000+ book collection and read blog posts. Admin dashboard for Brigitte (and optional admins) to manage content.

**Target Launch:** Christmas 2025 (MVP)

---

## Tech Stack

### Frontend
- **Framework:** React (Vite for faster dev experience)
- **Routing:** React Router v6
- **State Management:** Context API + useState/useReducer
- **HTTP Client:** Axios
- **Rich Text Editor:** TipTap (for blog posts)
- **Styling:** TBD (Tailwind CSS recommended for rapid development)
- **Testing:** Jest + React Testing Library (Phase 2)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken + bcrypt)
- **Validation:** express-validator
- **Testing:** Jest + Supertest
- **Security:** helmet, cors, express-rate-limit, express-mongo-sanitize

### DevOps
- **Hosting:** Render (frontend + backend)
- **Version Control:** GitHub
- **Environment Management:** dotenv

---

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required, lowercase),
  password: String (hashed, required),
  role: String (enum: ['admin', 'super-admin'], default: 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

**Initial Users:**
- Brigitte (admin)
- You (super-admin)
- Megan (admin, optional)

### Book Model
```javascript
{
  _id: ObjectId,
  title: String (required, indexed),
  author: String (required, indexed),
  genre: String (indexed),
  publicationYear: Number,
  isbn: String (unique, sparse),
  coverImage: String (URL),
  brigittesRating: Number (0-10, allows decimals),
  brigittesNotes: String (rich text or plain text),
  tags: [String] (for cross-linking with blog posts),
  addedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Text index on title, author for search
- Compound index on genre, author for filtering

### BlogPost Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  slug: String (unique, auto-generated from title),
  content: Object (TipTap JSON format),
  excerpt: String (auto-generated or manual),
  tags: [String] (indexed),
  author: ObjectId (ref: User),
  status: String (enum: ['draft', 'published'], default: 'draft'),
  publishedAt: Date,
  likes: Number (default: 0),
  likedBy: [String] (IP addresses or session IDs to prevent spam),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Unique index on slug
- Index on status, publishedAt for public queries
- Text index on title, excerpt for search

---

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Create new admin user (protected, super-admin only)
- `POST /login` - Login, returns JWT
- `POST /refresh` - Refresh JWT token
- `POST /logout` - Invalidate token (optional, client-side mostly)
- `GET /me` - Get current user info (protected)

### Books (`/api/books`)
- `GET /` - List all books (public, with search/filter query params)
- `GET /:id` - Get single book details (public)
- `POST /` - Create new book (protected, admin only)
- `PUT /:id` - Update book (protected, admin only)
- `DELETE /:id` - Delete book (protected, admin only)
- `POST /import` - Bulk import books (protected, Phase 2)

**Search/Filter Query Params:**
- `?search=` - Full-text search on title/author
- `?genre=` - Filter by genre
- `?author=` - Filter by author
- `?minRating=` & `?maxRating=` - Filter by Brigitte's rating
- `?sort=` - Sort by title, author, rating, year
- `?page=` & `?limit=` - Pagination

### Blog Posts (`/api/posts`)
- `GET /` - List published posts (public, with pagination/tag filter)
- `GET /admin/all` - List all posts including drafts (protected, admin only)
- `GET /:slug` - Get single post by slug (public, published only)
- `POST /` - Create new post (protected, admin only)
- `PUT /:id` - Update post (protected, admin only)
- `DELETE /:id` - Delete post (protected, admin only)
- `POST /:id/like` - Increment like counter (public, rate-limited)

**Query Params:**
- `?tag=` - Filter by tag
- `?page=` & `?limit=` - Pagination

---

## Project Structure

```
brigittes-library/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── env.js             # Environment config validation
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verification
│   │   │   ├── errorHandler.js   # Global error handler
│   │   │   ├── validators.js     # Express-validator schemas
│   │   │   └── rateLimiter.js    # Rate limiting configs
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Book.js
│   │   │   └── BlogPost.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── books.js
│   │   │   └── posts.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── bookController.js
│   │   │   └── postController.js
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   ├── slugify.js
│   │   │   └── sanitize.js
│   │   └── app.js                # Express app setup
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── books.test.js
│   │   └── posts.test.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   ├── library/
│   │   │   │   ├── BookCard.jsx
│   │   │   │   ├── BookDetailModal.jsx
│   │   │   │   ├── BookFilters.jsx
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── blog/
│   │   │   │   ├── PostCard.jsx
│   │   │   │   ├── PostDetail.jsx
│   │   │   │   ├── TipTapRenderer.jsx
│   │   │   │   └── LikeButton.jsx
│   │   │   └── admin/
│   │   │       ├── BookForm.jsx
│   │   │       ├── PostEditor.jsx (TipTap integration)
│   │   │       ├── DashboardLayout.jsx
│   │   │       └── AdminNav.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Library.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── BlogPost.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── ManageBooks.jsx
│   │   │   │   └── ManagePosts.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios instance + API calls
│   │   ├── utils/
│   │   │   ├── formatDate.js
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── PLAN.md (this file)
```

---

## Security & Testing Requirements

### Security (Built-in from Day 1)
1. **Input Validation:**
   - express-validator on all POST/PUT endpoints
   - Sanitize HTML in blog posts (TipTap has built-in sanitization)
   - Mongoose schema validation as second layer

2. **Rate Limiting:**
   - Auth endpoints: 5 requests/15 minutes per IP
   - Like button: 10 requests/hour per IP
   - Search/filter: 100 requests/15 minutes per IP
   - Admin endpoints: Higher limits for authenticated users

3. **Authentication:**
   - bcrypt for password hashing (12 rounds)
   - JWT with short expiration (15 min access, 7 day refresh)
   - HTTP-only cookies for tokens (if using cookies) or secure localStorage

4. **Headers & CORS:**
   - Helmet for security headers
   - CORS configured for frontend domain only
   - Content Security Policy (CSP)

5. **Database:**
   - express-mongo-sanitize to prevent NoSQL injection
   - Parameterized queries via Mongoose (built-in protection)

### Testing Strategy
1. **Backend (Jest + Supertest):**
   - Unit tests for utility functions
   - Integration tests for all API endpoints
   - Auth flow testing (login, protected routes, token refresh)
   - Input validation testing (malformed data, XSS attempts)
   - Rate limiting verification

2. **Frontend (Phase 2):**
   - Component unit tests (React Testing Library)
   - Integration tests for key user flows
   - E2E tests with Playwright (optional, Phase 3)

---

## Implementation Phases

### Phase 1: MVP (Target: Christmas 2025)
**Backend:**
- ✅ Project setup + MongoDB connection
- ✅ User model + JWT authentication
- ✅ Book model + CRUD API with search/filter
- ✅ BlogPost model + CRUD API
- ✅ All security middleware
- ✅ Comprehensive API tests

**Frontend:**
- ✅ Project setup + routing
- ✅ Public library browser (search, filter, book details)
- ✅ Public blog view (list, detail, like button)
- ✅ Admin login
- ✅ Admin book management (add, edit, delete)
- ✅ Admin blog management (TipTap editor, draft/publish)
- ✅ Responsive design

**Deployment:**
- ✅ Render configuration
- ✅ Environment variables setup
- ✅ Initial deployment

### Phase 2: Post-Christmas Enhancements
- Bulk book import (CSV/API)
- Frontend testing suite
- Mailing list signup (with spam protection)
- Analytics (view counts, popular books)
- Image optimization/CDN (Cloudinary)
- Advanced search (fuzzy matching, autocomplete)
- Blog post series/collections

### Phase 3: Monetization & Advanced Features
- Buy Me a Coffee integration
- Newsletter system
- Social sharing
- SEO optimization
- Performance monitoring
- A/B testing for blog layouts

---

## Environment Variables

### Backend (`.env`)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Development Workflow

1. **Branch Strategy:**
   - `main` - production-ready code
   - `develop` - active development
   - Feature branches: `feature/book-crud`, `feature/blog-editor`, etc.

2. **Commit Conventions:**
   - `feat:` new features
   - `fix:` bug fixes
   - `test:` testing additions
   - `refactor:` code improvements
   - `docs:` documentation updates

3. **Testing Before Merge:**
   - All tests must pass
   - Manual testing of new features
   - Code review (you reviewing Claude's work 😄)

---

## Open Questions / Future Decisions

1. **Styling approach:** Tailwind CSS, CSS Modules, styled-components, or plain CSS?
2. **Cover image upload:** Direct to MongoDB (GridFS), Cloudinary, or file system?
3. **Book data import:** Manual entry, CSV upload, or ISBN API (Google Books, Open Library)?
4. **Homepage design:** Feature recent blog posts, popular books, or custom hero section?
5. **Mobile navigation:** Hamburger menu or bottom nav bar?

---

## Notes

- Focus on getting core features working first, then polish
- Brigitte's feedback will shape Phase 2+
- Keep admin UI simple and intuitive (she's the primary user)
- Public site should showcase her personality and love of books
- Testing is non-negotiable - build it right from the start

---

**Last Updated:** November 18, 2025
