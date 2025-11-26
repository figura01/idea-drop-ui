import { createContext, useContext, useState, useEffect } from "react";
import { refreshAccessToken } from "@/api/auth";
import { setStoredAccessToken } from "@/lib/authToken";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: { id: string; name: string; email: string } | null;
  setUser: (user: AuthContextType["user"]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  useEffect(() => {
    // Logic to refresh token or check authentication status can be added here
    const loadAuth = async () => {
      try {
        const { accessToken: newToken, user } = await refreshAccessToken();
        setAccessToken(newToken);
        setUser(user);
        setStoredAccessToken(newToken);
      } catch (error) {
        console.error("Failed to load auth state:", error);
      }
    };
    loadAuth();
  }, []);

  useEffect(() => {
    setStoredAccessToken(accessToken);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an provider");
  }
  return context;
};
