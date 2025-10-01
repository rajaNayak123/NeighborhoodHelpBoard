// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import authService from "../services/authService"; // Import the service

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await authService.getMe();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    await authService.login(email, password);
    // After successful login, get user data from the server
    const { data } = await authService.getMe();
    setUser(data);
  };

  const logout = async () => {
    try {
      // Call logout API to clear the httpOnly cookie
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear user state, even if API call fails
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
