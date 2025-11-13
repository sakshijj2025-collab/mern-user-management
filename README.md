# User Management System (Frontend)

A fully responsive **User Management System** built with **React + Tailwind CSS**, integrated with the **Platzi API** for authentication and user CRUD operations.

This project supports:

- 🔐 Login / Logout (JWT Authentication)
- 🔒 Protected Routes
- 👤 User CRUD (Create, Read, Update, Delete)
- 📱 Fully Responsive UI (Desktop + Mobile)
- 🔍 Search + Filter by Role
- 📄 Pagination
- 🖼 Avatar Preview
- 🌙 Dark Mode (Optional)
- ⚠ Error handling with toast notifications


## 🏗 Tech Stack

### **Frontend**
- React (Vite)
- React Router DOM
- Context API for authentication
- Axios for API calls
- Tailwind CSS
- react-hot-toast
- Modern responsive layout (mobile + desktop)


## 📌 Requirements (Assignment Overview)

### **Authentication**
Use Platzi Login API:
POST https://api.escuelajs.co/api/v1/auth/login

Store token in **localStorage** and protect routes.

### **User CRUD**
Use Platzi Users API:

GET /users

GET /users/:id

POST /users

PUT /users/:id

DELETE /users/:id


### **Frontend Pages**
| Page | Description |
|------|-------------|
| Login Page | Email + Password login using JWT |
| User List | Table + mobile card view with pagination, search, filter |
| Add User | Create new user |
| Edit User | Update user |
| Delete User | Modal confirmation |

---


## ⚙️ Setup Instructions

### 1️⃣ Clone the repo
git clone git@github.com:sakshijj2025-collab/mern-user-management.git
cd mern-user-management


### 2️⃣ Install dependencies
npm install

### 3️⃣ Setup Tailwind (already configured)
npx tailwindcss init -p


### 4️⃣ Run the app
npm run dev


## 🔑 Login Credentials (for testing)

Platzi's public test user:

Email: john@mail.com
Password: changeme


Or create your own user using:
POST https://api.escuelajs.co/api/v1/users

---

## 🔥 Features Explained

### ✔ Authentication (JWT)
- Login using `/auth/login`
- Retrieve user profile `/auth/profile`
- Token saved in `localStorage`
- Logout clears all stored data

### ✔ Protected Routes
- Users can access `/users`, `/users/new`, `/users/:id` only if logged in

### ✔ User List
- Search by name or email
- Filter by role
- Pagination
- Mobile card layout
- Delete popup modal
- Edit button
- Avatar display

### ✔ Add / Edit User
- Form fields: name, email, password, avatar, role
- Avatar preview
- Handles API validation errors
- Update user without forcing password change

---

## 🧪 API Endpoints Used

### **Authentication**
| Method | Endpoint | Purpose |
|--------|----------|----------|
| POST | `/auth/login` | Get JWT Token |
| GET | `/auth/profile` | Logged-in user profile |

### **Users**
| Method | Endpoint | Purpose |
|--------|----------|----------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get specific user |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

---

## 🔐 ProtectedRoute Logic

- If no token → redirect to `/login`
- If token exists → continue to page

---


## 📌 Git Commit Rules

### First commit:
git commit -m "INITIAL COMMIT"


### Final commit after completing assignment:
git commit -m "TASK COMPLETED"


---

## 👨‍💻 Author
**Sakshi Jain**  
React Full Stack Developer  

---

## 📄 License
This project is open-source for learning and assignment purposes.

---

