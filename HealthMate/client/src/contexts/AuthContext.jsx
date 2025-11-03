import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigateCallbackRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Logged in successfully!');
      if (navigateCallbackRef.current) {
        navigateCallbackRef.current('/dashboard');
      } else {
        window.location.href = '/dashboard';
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const register = async (name, email, password, role = 'patient') => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Registered successfully!');
      if (navigateCallbackRef.current) {
        navigateCallbackRef.current('/dashboard');
      } else {
        window.location.href = '/dashboard';
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    if (navigateCallbackRef.current) {
      navigateCallbackRef.current('/login');
    } else {
      window.location.href = '/login';
    }
    toast.success('Logged out successfully');
  };

  const setNavigateCallback = (navigate) => {
    navigateCallbackRef.current = navigate;
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    setNavigateCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
