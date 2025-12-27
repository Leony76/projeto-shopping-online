import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import type { User } from "../types/User";

type AuthContextType = {
  user: User | null;
  loading: Boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }:{ children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    api.get("/user")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async(email: string, password: string) => {
    await api.post("/login", { email, password });
    const res = await api.get("/user");
    setUser(res.data);  
  }

  const register = async (name: string, email: string, password: string) => {
    await api.post("/register", { name, email, password });
    const res = await api.get("/user");
    setUser(res.data);
  };

  const logout = async() => {
    await api.post("/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
