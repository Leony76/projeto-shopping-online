import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  async function handleLogout() {
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      await logout();
    } catch (err) {
      console.warn("Token já inválido:", err);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }

  return handleLogout;
}
