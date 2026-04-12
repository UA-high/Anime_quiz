# Anime Quiz Application

A full-stack Anime Quiz application built with Express.js and MongoDB on the backend, and React on the frontend. The project features a robust authentication system, a user dashboard, and multiple quiz types (MCQ and Picture-based questions).

## 🚀 Tech Stack

### Backend
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** Dual-token system (JWT Access + Refresh Tokens)
- **Middleware:** Cookie-parser, Bcrypt, Multer
- **Image Upload:** ImageKit.io
- **Runtime:** Node.js

### Frontend
- **Library:** React (Vite)
- **Styling:** Vanilla CSS
- **State Management:** React Hooks (Context API/Redux assumed for future)

---

## 📂 Project Structure

```text
/
├── backend/                # Express server and logic
│   ├── src/
│   │   ├── config/         # Configuration (DB, Cloud, etc.)
│   │   ├── controllers/    # Route handlers & Business logic
│   │   ├── db/             # Database connection setup
│   │   ├── middlewares/    # Auth & Admin authorization
│   │   ├── models/         # Mongoose models (User, MCQ, Picqs)
│   │   ├── routes/         # API routes definition
│   │   └── services/       # External services (ImageKit upload)
│   ├── seed.js             # Database seeding script
│   └── server.js           # Entry point
└── frontend/               # React application
    ├── src/
    │   ├── assets/         # Static images & icons
    │   └── App.jsx         # Main application component
    └── index.html
```

---

## 🔐 Authentication & Security

The application implements a secure authentication flow using a dual-token mechanism:

1.  **Access Token:**
    *   Short-lived (15 minutes).
    *   Returned in the response body on login/register.
    *   Stored in frontend memory (not localStorage) for security.
    *   Must be sent in the `Authorization: Bearer <token>` header for all protected requests.
2.  **Refresh Token:**
    *   Long-lived (7 days).
    *   Stored in an `httpOnly`, `secure`, `sameSite` cookie.
    *   Used to obtain a new Access Token via the `/refresh-token` endpoint.
    *   Rotated on every use for enhanced security.

---

## 🛣️ API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user. Returns user data and Access Token.
- `POST /login`: Login and receive Access Token. Refresh Token is set in cookie.
- `POST /logout`: Logout and clear the refresh token cookie.
- `POST /refresh-token`: Exchange a valid Refresh Token for a new Access Token and a rotated Refresh Token.

### Admin Routes (`/api/admin`) - *Requires Admin Role*
- `POST /upload/mcq`: Upload a multiple-choice question (supports optional image).
- `POST /upload/picqs`: Upload a picture-based question (requires image).

### User Routes (`/api/:user`) - *Requires Authentication*
- `GET /dashboard`: Fetch the authenticated user's profile and stats.
- `GET /quiz`: Fetch quiz questions.
  - **Body parameters:** `{ "type": "mcq" | "picq", "count": number }`

---

## ✨ Features
- **Secure Auth:** JWT-based access/refresh token rotation with cookie storage.
- **Admin Dashboard:** Tools for administrators to upload and manage quiz content.
- **Multi-Format Quizzes:** Supports standard MCQs and visual "Guess the Anime" picture questions.
- **Cloud Image Hosting:** High-performance image delivery via ImageKit.io.
- **Dynamic Content:** Randomized question fetching for a fresh experience every time.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance (local or Atlas)
- ImageKit.io account

### Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

### Installation & Run
1.  **Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
