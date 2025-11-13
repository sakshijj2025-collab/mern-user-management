# User Management System (React + Tailwind + Platzi API)

A frontend-first **User Management System** built with **React**, **Tailwind CSS**, and **Platzi Fake Store API**.  
The app demonstrates:

- JWT-based **Login / Logout**
- **Protected routes** using React Router and Context
- Full **User CRUD** (Create, Read, Update, Delete)
- **Search, Filter, Pagination**
- **Toast notifications** and **confirmation modal**
- Responsive, clean UI with **Tailwind**

---

## 🚀 Features

### Authentication

- Login using Platzi API:

  `POST https://api.escuelajs.co/api/v1/auth/login`

- JWT stored in `localStorage`
- Auth state managed via **Context API**
- Protected routes (only accessible when logged in)
- Logout clears token + redirects to login

### Users Management (CRUD)

Uses `https://api.escuelajs.co/api/v1/users`:

- `GET /users` – Fetch all users (list view)
- `GET /users/:id` – Load single user for edit
- `POST /users` – Create new user
- `PUT /users/:id` – Update existing user
- `DELETE /users/:id` – Delete user

UI includes:

- User list in responsive table
- Add User form
- Edit User form
- Delete action with confirmation modal

### UX Enhancements

- 🔍 Search by **name or email**
- 🎯 Filter by **role** (`all / customer / admin`)
- 📄 Pagination (client-side) with page numbers & prev/next
- 🍞 Toast notifications on create/update/delete/load errors (react-hot-toast)
- 💡 Skeleton loader for users table
- 🌗 Dark mode toggle (light/dark theme)
- Mobile-first responsive layout

---

## 🛠 Tech Stack

- **React 18+**
- **React Router v6**
- **Context API** for authentication state
- **Axios** for HTTP calls
- **Tailwind CSS** for styling
- **react-hot-toast** for toast notifications
- Vite as bundler

---

## 📦 Getting Started

### 1. Clone the repo

```bash
git clone <YOUR_REPO_URL>
cd mern-user-management
