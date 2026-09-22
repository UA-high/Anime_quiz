import { login, register, logout, getDashboard } from "../services/auth.api";
import { AuthContext } from "../Auth.context";
import { useContext, useCallback } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading, setLoading, isInitialized } = context;

  const handleLogin = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  const handleRegister = useCallback(async ({ username, email, password, role = "user" }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password, role });
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Registration failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      return { success: true };
    } catch (err) {
      setUser(null);
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  const refreshUserData = useCallback(async () => {
    try {
      const data = await getDashboard();
      if (data?.user) {
        setUser(data.user);
        return data.user;
      }
    } catch (err) {
      console.error("Failed to refresh user data", err);
    }
    return null;
  }, [setUser]);

  return {
    handleLogin,
    handleRegister,
    handleLogout,
    refreshUserData,
    loading,
    user,
    setUser,
    isInitialized,
  };
};