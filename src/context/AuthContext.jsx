import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('agrigrow_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('agrigrow_token') || null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync session with backend on mount if token exists
  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('agrigrow_user', JSON.stringify(data.user));
        } else {
          // Token invalid or expired
          logout();
        }
      })
      .catch(() => {
        // Server offline - preserve existing local session gracefully
      });
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!data.success) {
        setAuthError(data.message || 'فشل تسجيل الدخول');
        return { success: false, message: data.message };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('agrigrow_user', JSON.stringify(data.user));
      localStorage.setItem('agrigrow_token', data.token);

      return { success: true, user: data.user };
    } catch (err) {
      setLoading(false);
      const msg = 'تعذر الاتصال بالسيرفر. يرجى التأكد من تشغيل الخادم.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!data.success) {
        setAuthError(data.message || 'فشل إنشاء الحساب');
        return { success: false, message: data.message };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('agrigrow_user', JSON.stringify(data.user));
      localStorage.setItem('agrigrow_token', data.token);

      return { success: true, user: data.user };
    } catch (err) {
      setLoading(false);
      const msg = 'تعذر الاتصال بالسيرفر. يرجى التأكد من تشغيل الخادم.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agrigrow_user');
    localStorage.removeItem('agrigrow_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
