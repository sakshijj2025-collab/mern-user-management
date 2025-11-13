import axios from "axios";

const api = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1",
});

// GLOBAL API ERROR HANDLING
api.interceptors.response.use(
  (res) => res,
  (err) => {
    let message = "Something went wrong";

    if (err.response?.data?.message) {
      message = err.response.data.message;
    } else if (err.message) {
      message = err.message;
    }

    return Promise.reject(new Error(message));
  }
);

// LOGIN
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

// USERS CRUD
export const getUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
