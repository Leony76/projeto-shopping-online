import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";
import { UserContext } from "./UserContext";
import { api } from "../services/api";

export const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    const loadUserData = async() => {
      try {
        const response = await api.get('/user');
        setUser(response.data);

        localStorage.setItem("user", JSON.stringify(response.data));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  },[]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    navigate("/login");
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading}}>
      {children}
    </UserContext.Provider>
  );
}