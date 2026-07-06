import { useState } from "react";
import { AuthContext } from "./auth";
import { getAccessToken, clearTokens, setLoginTime, setTokens } from "../utils/token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAccessToken()));

  const login = (access_token: string, refresh_token: string) => {
    setTokens(access_token, refresh_token);
    setLoginTime();
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
