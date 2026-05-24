# Store Rating Platform

A full-stack web application that allows users to submit ratings for registered stores. Built with **Express.js**, **NeonDB (PostgreSQL)**, and **React.js**.

---

## Features

- Role-based access control with three user types: **System Administrator**, **Normal User**, and **Store Owner**
- Admins can manage users and stores via a dedicated dashboard
- Normal users can browse stores, submit ratings (1–5), and update their ratings
- Store owners can view who rated their store and see the average rating
- JWT-based authentication with protected routes
- Password update functionality for all logged-in users

---

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Backend   | Node.js, Express.js                           |
| Database  | NeonDB (Serverless PostgreSQL)                |
| Frontend  | React.js, Vite, Tailwind CSS                  |
| Auth      | JSON Web Tokens (JWT), bcrypt                 |

---

## Project Structure

```
INTERNPROJ/
├── backend/
│   ├── config/           # DB connection and app config
│   ├── controllers/      # Route handler logic
│   ├── middlewares/      # Auth (protect, authorizeRoles)
│   ├── routes/           # Express routers
│   ├── .env              # Backend environment variables
│   ├── package.json
│   └── server.js         # Entry point
│
└── frontend/
    ├── components/       # Reusable React components
    ├── public/           # Static assets
    ├── src/              # Pages, hooks, utilities
    ├── .env              # Frontend environment variables
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## Prerequisites

Make sure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A free [NeonDB](https://neon.tech) account (no local PostgreSQL installation required)

---

## Environment Variables

### Backend — `backend/.env`

This project uses **NeonDB** as its database. NeonDB provides a single connection string — no need to configure host, port, or database name separately.

```env
PORT=3000
DATABASE_URL=postgresql://your_user:your_password@your_project.neon.tech/your_db?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
```

> Get your `DATABASE_URL` from the **NeonDB dashboard → your project → Connection Details → Connection string**.

### Frontend — `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AnyxByte/RateMyStore
cd RateMyStore
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Paste your NeonDB connection string into `DATABASE_URL` in `.env`, then start the server:

```bash
npm run dev
```

The API will be running at `http://localhost:3000`.

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be running at `http://localhost:5173`.

---

## Database Setup

This project uses **[NeonDB](https://neon.tech)** — a serverless PostgreSQL platform. There is no local database to install or manage.

### Step 1 — Create a NeonDB project

1. Go to [neon.tech](https://neon.tech) and sign up for a free account
2. Click **New Project** and give it a name (e.g. `store-rating-platform`)
3. NeonDB will create a default database automatically
4. Copy the **Connection string** from the dashboard — it looks like:
   ```
   postgresql://user:password@project.neon.tech/dbname?sslmode=require
   ```
5. Paste it as `DATABASE_URL` in `backend/.env`

### Step 2 — Admin credentials

Admin login credentials will be shared separately. Please contact the project owner to get access.
email:- admin@admin.com 
password:- Suprodip456@
Also the above email , password is only for the deployed version of this code

---

## API Overview

### Auth Routes — `/api/auth`

| Method | Endpoint         | Access  | Description                      |
|--------|------------------|---------|----------------------------------|
| POST   | `/signup`        | Public  | Register a new normal user       |
| POST   | `/login`         | Public  | Login and receive a JWT token    |
| POST   | `/verify-role`   | Private | Verify the logged-in user's role |

### User Routes — `/api/users`

| Method | Endpoint            | Access  | Description                          |
|--------|---------------------|---------|--------------------------------------|
| POST   | `/update`           | Private | Update user profile details          |
| GET    | `/all`              | Private | Fetch all users                      |
| POST   | `/change-password`  | Private | Change the logged-in user's password |

### Store Routes — `/api/stores`

| Method | Endpoint            | Access     | Description                               |
|--------|---------------------|------------|-------------------------------------------|
| GET    | `/feed`             | User only  | Browse all stores with ratings            |
| POST   | `/rate`             | User only  | Submit or update a rating for a store     |
| GET    | `/owner-dashboard`  | StoreOwner | View raters list and average store rating |

### Admin Routes — `/api/admin`

| Method | Endpoint                | Access | Description                         |
|--------|-------------------------|--------|-------------------------------------|
| GET    | `/dashboard-extended`   | Admin  | Total users, stores, and ratings    |
| POST   | `/users/create`         | Admin  | Create a new user (any role)        |
| POST   | `/stores/create`        | Admin  | Add a new store                     |

> All `/api/admin` routes require a valid JWT and the `Admin` role.

---

## User Roles

### System Administrator
- Created directly via another admin
- Can add stores, normal users, and admin accounts
- Has access to a dashboard with platform-wide statistics
- Can filter and sort all user and store listings

### Normal User
- Self-registers via the signup page
- Can browse and search stores by name or address
- Can submit and update ratings (1 to 5) for any store
- Can update their own password

### Store Owner
- Account created by an Admin (no self-registration)
- Can view a list of users who rated their store
- Can see the average rating of their store
- Can update their own password

---

## Form Validations

All validations are enforced on both the frontend and the backend.

| Field    | Rule                                                                  |
|----------|-----------------------------------------------------------------------|
| Name     | Minimum 20 characters, maximum 60 characters                         |
| Address  | Maximum 400 characters                                               |
| Password | 8–16 characters, at least one uppercase letter, one special character |
| Email    | Must follow standard email format                                    |
| Rating   | Integer between 1 and 5 (inclusive)                                  |

---

## Scripts

### Backend

| Command           | Description                       |
|-------------------|-----------------------------------|
| `npm run dev`     | Start server with nodemon (watch) |
| `npm start`       | Start server in production mode   |

### Frontend

| Command             | Description                        |
|---------------------|------------------------------------|
| `npm run dev`       | Start Vite dev server              |
| `npm run build`     | Build for production               |

---
