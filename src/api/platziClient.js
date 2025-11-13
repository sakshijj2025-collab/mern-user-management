import axios from 'axios';

const API_BASE_URL = 'https://api.escuelajs.co/api/v1';

const platziClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token from localStorage to every request
platziClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const login = (email, password) =>
  platziClient.post('/auth/login', { email, password });

// USERS CRUD
export const getUsers = () => platziClient.get('/users');

export const getUserById = (id) => platziClient.get(`/users/${id}`);

export const createUser = (user) => platziClient.post('/users', user);

export const updateUser = (id, user) => platziClient.put(`/users/${id}`, user);

export const deleteUser = (id) => platziClient.delete(`/users/${id}`);

export default platziClient;
