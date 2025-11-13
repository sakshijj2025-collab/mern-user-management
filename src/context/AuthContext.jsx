import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // Axios instance
  const api = axios.create({
    baseURL: "https://api.escuelajs.co/api/v1/"
  });

  // Attach token only AFTER login
  api.interceptors.request.use((config) => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  });

  // LOGIN FUNCTION (critical fix)
  const login = async (email, password) => {
    setLoading(true);

    try {
      // 1) login request MUST NOT use interceptors
      const loginRes = await axios.post(
        "https://api.escuelajs.co/api/v1/auth/login",
        { email, password }
      );

      const accessToken = loginRes.data.access_token;
      if (!accessToken) throw new Error("Token missing");

      // save token
      setToken(accessToken);
      localStorage.setItem("token", accessToken);

      // 2) fetch profile (now interceptor will include token)
      const profileRes = await api.get("/auth/profile");
      setUser(profileRes.data);
      localStorage.setItem("user", JSON.stringify(profileRes.data));

      return true;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
