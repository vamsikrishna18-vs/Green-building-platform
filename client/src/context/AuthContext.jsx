import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  getStoredToken
} from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Automatically restore session on page load/refresh
  useEffect(() => {
    async function restoreSession() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }
    restoreSession();
  }, []);

  const login = async ({ email, password }) => {
    const data = await loginUser({ email, password });
    setUser(data.user);
    return data;
  };

  const register = async ({ name, email, password }) => {
    const data = await registerUser({ name, email, password });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
