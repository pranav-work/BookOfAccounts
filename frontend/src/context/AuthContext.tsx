import { createContext, useContext, useState, useEffect } from "react";
import { getAccessToken, clearTokens, setTokens } from "../utils/token";

type AuthContectType = {
  isAuthenticated: boolean;
  login: (access_token: string, refresh_token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContectType | null >(null);

export const useAuth = () =>{
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (access_token: string, refresh_token: string) => {
    setTokens(access_token, refresh_token);
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