// import { 
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react"

// import type { ReactNode } from "react";
// import { useNavigate } from "react-router-dom";

// type User = {
//   id: number;
//   name: string;
//   email: string;
//   admin: boolean;
// };

// type AuthContextType = {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// export const AuthProvider = ({children}:{children:ReactNode}) => {
//   const [user, setUser] = useState<User | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");

//     if (storedUser) {
//       const parsed = JSON.parse(storedUser);
//       setUser(parsed);
//     }
//   },[]);

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setUser(null);

//     navigate("/login");
//   }

//   return (
//     <AuthContext.Provider value={{user, setUser, logout}}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext);