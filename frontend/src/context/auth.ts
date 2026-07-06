import { createContext, useContext } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (access_token: string, refresh_token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};
