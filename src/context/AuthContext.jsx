import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginApi } from '../api/platziClient';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load profile when token present
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          'https://api.escuelajs.co/api/v1/auth/profile',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        setToken(null);
        localStorage.removeItem('token');
        setUser(null);
      }
    };

    if (token && !user) {
      fetchProfile();
    }
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1) Get token
      const res = await loginApi(email, password);
      const accessToken = res.data.access_token;

      // 2) Save token
      setToken(accessToken);
      localStorage.setItem('token', accessToken);

      // 3) Load user profile
      const profileRes = await axios.get(
        'https://api.escuelajs.co/api/v1/auth/profile',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setUser(profileRes.data);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

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

export const useAuth = () => useContext(AuthContext);
