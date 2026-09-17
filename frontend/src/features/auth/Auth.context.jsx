import { createContext, useState, useEffect } from "react";
import { getRefreshToken, getDashboard, setAccessToken } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const refreshData = await getRefreshToken();
        if (refreshData?.accessToken && isMounted) {
          setAccessToken(refreshData.accessToken);
          // If refresh returned user details, use that; otherwise fetch from dashboard
          if (refreshData.user) {
            setUser(refreshData.user);
          } else {
            const dashData = await getDashboard();
            if (dashData?.user) {
              setUser(dashData.user);
            }
          }
        }
      } catch (err) {
        // No active session or expired refresh token
        setAccessToken(null);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsInitialized(true);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};