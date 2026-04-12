# Anime Quiz Application

A full-stack Anime Quiz application built with Express.js and MongoDB on the backend, and React on the frontend. The project features authentication, a user dashboard, and different quiz types (MCQ and Picture-based questions).

## 🚀 Tech Stack

### Backend
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Token), Cookie-parser, Bcrypt
- **Image Upload:** Multer, ImageKit.io
- **Runtime:** Node.js

### Frontend
- **Library:** React (Vite)
- **Styling:** CSS (App.css, index.css)
- **Routing:** React Router (assumed based on React 19 and common patterns)

---

## 📂 Project Structure

```text
/
├── backend/                # Express server and logic
│   ├── src/
│   │   ├── config/         # Configuration (DB, etc.)
│   │   ├── controllers/    # Route handlers
│   │   ├── db/             # Database connection
│   │   ├── models/         # Mongoose models (User, MCQ, Picqs)
│   │   ├── routes/         # API routes
│   │   └── services/       # Services (Image upload, etc.)
│   ├── seed.js             # Initial data seeding script
│   └── server.js           # Server entry point
└── frontend/               # React application
    ├── src/
    │   ├── assets/         # Static assets
    │   └── App.jsx         # Main React component
    └── index.html
```

---

## 🛣️ API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user.
- `POST /login`: Login and receive an authentication cookie.
- `POST /logout`: Logout and clear the authentication cookie.

### Admin Routes (`/api/admin`)
- `POST /upload/mcq`: Upload a multiple-choice question (with optional image).
- `POST /upload/picqs`: Upload a picture-based question (requires image).

### User Routes (`/api/:user`)
- `GET /dashboard`: Fetch the user's dashboard data.
- `GET /quiz`: Fetch quiz questions (MCQs).

---

## 🛠️ Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance (local or Atlas)
- ImageKit.io account (for image uploads)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (if applicable) or configure `src/config/config.js` with:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - ImageKit credentials
4. Seed the database (optional):
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```


### Access Token & Refresh Token implementation
1. Generate the access token and refresh token while login and register
2. Send the access token with the response and save the refresh token in the cookies
3. After expiration of access token every 15min generate a new access token using the refresh token and also for the security purposes generate the refresh token as well
4. The access token in saved in the frontend memory and sends the access token in the request headers to verify with every request
---

## ✨ Features
- **User Authentication:** Secure registration and login using JWT and cookies.
- **Admin Panel:** Upload new questions directly to the database.
- **Quiz variety:** Supports both standard MCQs and picture-based questions.
- **Dynamic Dashboard:** Personalized user dashboard fetching progress/stats.
