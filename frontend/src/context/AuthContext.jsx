import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('parachute_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
      setAuthToken(parsed.token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const authToken = response.data.access_token;
    setAuthToken(authToken);
    const profile = await api.get('/auth/profile');
    const payload = { user: profile.data, token: authToken };
    localStorage.setItem('parachute_auth', JSON.stringify(payload));
    setUser(profile.data);
    setToken(authToken);
    return profile.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('parachute_auth');
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
