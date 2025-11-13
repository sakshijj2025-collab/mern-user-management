import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // API instance
  const api = axios.create({
    baseURL: "https://api.escuelajs.co/api/v1",
  });

  // Inject token on every request
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 🔐 LOGIN FUNCTION
  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1) Get JWT token
      const res = await api.post("/auth/login", { email, password });
      const accessToken = res.data.access_token;

      if (!accessToken) {
        throw new Error("Login failed: No access token received");
      }

      // Save token
      setToken(accessToken);
      localStorage.setItem("token", accessToken);

      // 2) Fetch user profile
      const profileRes = await api.get("/auth/profile");
      const profile = profileRes.data;

      // Save user profile
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));

      return true;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // 🔄 Load user from storage on refresh
  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    const existingUser = localStorage.getItem("user");

    if (existingToken && existingUser) {
      setToken(existingToken);
      setUser(JSON.parse(existingUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
