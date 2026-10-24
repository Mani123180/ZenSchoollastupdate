import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState([]);

  useEffect(() => {
    // Load demo accounts list for easy role testing
    api.getDemoAccounts()
      .then((data) => {
        if (data.success) {
          setDemoAccounts(data.demoAccounts);
        }
      })
      .catch((err) => console.warn('Could not load demo accounts:', err.message));
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await api.login(username, password);
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const switchUser = async (targetUsername) => {
    const foundDemo = demoAccounts.find((d) => d.username === targetUsername);
    if (foundDemo) {
      return await login(foundDemo.username, foundDemo.passwordHint);
    }
    return { success: false, message: 'Account not found' };
  };

  const impersonate = (targetUser) => {
    // Save original super admin for exit masquerade
    const originalAdmin = localStorage.getItem('originalAdmin') || JSON.stringify(user);
    localStorage.setItem('originalAdmin', originalAdmin);
    setUser(targetUser);
    localStorage.setItem('user', JSON.stringify(targetUser));
  };

  const exitImpersonation = () => {
    const original = localStorage.getItem('originalAdmin');
    if (original) {
      const parsed = JSON.parse(original);
      setUser(parsed);
      localStorage.setItem('user', original);
      localStorage.removeItem('originalAdmin');
      return true;
    }
    return false;
  };

  const isImpersonating = !!localStorage.getItem('originalAdmin');

  return (
    <AuthContext.Provider value={{ user, token, loading, demoAccounts, login, logout, switchUser, impersonate, exitImpersonation, isImpersonating }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
