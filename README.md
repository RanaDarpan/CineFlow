# 🎬 CineFlow - Premium OTT Streaming Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Status](https://img.shields.io/badge/status-active-success.svg)

> **CineFlow** is a feature-rich full-stack OTT streaming platform built with the MERN stack, offering secure subscription management, multi-profile support, and an immersive playback experience for movies and series. It features a robust admin dashboard for content curation and a modern, responsive dark-themed frontend designed for seamless video streaming.

---

## 📸 Screen Captures
### 🔐 Authentication & Profiles

**SignUp**
<img src="./images/sign-up.png" alt="SignUp Page" width="800"/>

**Login**
<img src="./images/login.png" alt="Login Page" width="800"/>

**Profile Selection**
<img src="./images/profile-select.png" alt="Profile Selection" width="800"/>

---

### 🧭 Content Discovery

**Movies Home**
<img src="./images/movie-page.png" alt="Movies Home" width="800"/>

**Series Home**
<img src="./images/series-page.png" alt="Series Home" width="800"/>

---

### 🎬 Viewing Experience

**Movie Details**
<img src="./images/selected-movie-page.png" alt="Movie Details" width="800"/>

**Episode Player**
<img src="./images/selected-episode-page.png" alt="Episode Player" width="800"/>

---

### 👤 User Dashboard

**Watch History**
<img src="./images/all-watch-history-page.png" alt="Watch History" width="800"/>

**My Watchlist**
<img src="./images/watchlist-page.png" alt="Watchlist" width="800"/>

---

### 🛠️ Admin & Management

**Content Management**
<img src="./images/all-movies-page.png" alt="Admin Movie List" width="800"/>

**Review Control**
<img src="./images/reviews-admin-controls.png" alt="Review Moderation" width="800"/>

---

## 🏗️ Architecture & Tech Stack

CineFlow is built on a modern **MERN** architecture, designed for fast development and straightforward cloud deployment.

| Layer | Technology | Key Features |
|-------|------------|--------------|
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Redux Toolkit for state, Redux Persist for local storage, Axios for API communication. |
| **Backend** | ![Nodejs](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) | RESTful API design, specialized controllers for Content & User logic. |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) | Mongoose ODM with complex relationship modeling (Series -> Seasons -> Episodes). |
| **Media** | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white) | Optimized image/video storage and delivery. |

---

## ✨ Core Features

### 👤 User Experience & Identity
*   **Secure Authentication**: robust JWT-based auth flow (Access + Refresh tokens) ensuring secure sessions.
*   **Multi-Profile System**: 
    *   Create up to 5 profiles per account.
    *   **Isolated Data**: Each profile maintains its own Watch History, Watchlist, and Recommendations.
    *   **Avatar Customization**: Users can select unique avatars for their personas.
    *   **Subscription**: Only subscribed allowed to watch

### 📺 Content consumption
*   **Smart Watch History**: 
    *   **Resume Playback**: Automatically tracks progress. Users can resume movies/episodes exactly where they left off.
    *   **Progress Indicators**: Visual bars show completion status on all content cards.
    *   **Categorized History**: "Continue Watching" vs. "Completed" lists.
*   **Personal Watchlist**: "My List" feature for saving content to watch later.
*   **Interactive Reviews**: 
    *   User-generated ratings and comments.
    *   Edit/Delete capabilities for own reviews.
    *   "My Reviews" dashboard to manage feedback history.

### 🛠️ Admin Dashboard
*   **Comprehensive CMS**: Full Create, Read, Update, Delete (CRUD) operations for:
    *   Movies
    *   TV Series
    *   Seasons (linked to Series)
    *   Episodes (linked to Seasons)
*   **Media Management**: Direct upload integrations for thumbnails, banners, and video files.
*   **Content Organization**: Manage genres, age ratings, and release years.

### 🎨 UI/UX Design ("CineFlow" Theme)
*   **Immersive Dark Mode**: A "Content-First" dark aesthetic minimizing distractions.
*   **Mobile Responsive**: Fully optimized grid layouts that adapt from 4K desktops to mobile screens.
*   **Micro-Interactions**: Smooth hover effects, transitions, and loading skeletons for a polished feel.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
*   **Node.js**: v18.0.0 or higher
*   **MongoDB**: Local instance or MongoDB Atlas URI
*   **Cloudinary Account**: For media uploads

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/OTT.git
cd OTT
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # On Windows PowerShell: Copy-Item .env.example .env
```
Fill in your credentials in `backend/.env`, then start the development server:
```bash
npm run dev
```
The backend will run on `http://localhost:8000`.

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
cp .env.example .env   # On Windows PowerShell: Copy-Item .env.example .env
npm run dev
```
The frontend will run on `http://localhost:5173`.

---

## 🌐 Deployment Guide (Render + Vercel)

### Step 1: Deploy Backend (Render)
1. Push your repository to **GitHub**.
2. Go to [render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `PORT`: `8000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: your MongoDB Atlas connection string
   - `ACCESS_TOKEN_SECRET`: your secret string
   - `REFRESH_TOKEN_SECRET`: your secret string
   - `CLOUDINARY_CLOUD_NAME`: your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: your Cloudinary API secret
   - `ADMIN_EMAIL`: your admin email
   - `CORS_ORIGIN`: your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
6. Click **Deploy Web Service** and copy your backend URL (e.g., `https://your-backend.onrender.com`).

### Step 2: Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_SERVER`: `https://your-backend.onrender.com/api/v1`
5. Click **Deploy**.
6. Once deployed, copy your Vercel URL and update `CORS_ORIGIN` in Render to match this URL.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | API Port (default: `8000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CORS_ORIGIN` | Frontend origin(s) separated by commas |
| `ACCESS_TOKEN_SECRET` | Secret key for signing JWT access tokens |
| `REFRESH_TOKEN_SECRET` | Secret key for signing JWT refresh tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_EMAIL` | Email with administrative permissions |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_SERVER` | Full base URL to backend API (e.g., `http://localhost:8000/api/v1` or `https://your-backend.onrender.com/api/v1`) |

<p align="center">
  Built with ❤️ by Rana Darpan
</p>
