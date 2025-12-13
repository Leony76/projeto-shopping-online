import { useContext, createContext } from "react";
import type { User } from "../types/User";

export type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  loading: boolean;
};

export const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be inside UserProvider.')
  }
  
  return context;
}

