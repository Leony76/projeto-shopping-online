import { login } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [toast, setToast] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const { setUser } = useUser();

  const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault();

    if (email == '') {
      setToast({type: 'error', message: 'Preencha o campo de email'})
      return;
    }

    if (password == '') {
      setToast({type: 'error', message: 'Preencha o campo de senha'})
      return;
    }

    try {
      const data = await login(email, password);

      setUser(data.user);
      
      navigate("/dashboard");
    } catch {
      setToast({type: 'error', message: 'Email ou senha inválidos'});
    }
  }

  return (
    <>
      {toast && (
        <div>{toast.message}</div>
      )}
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div>
          <label htmlFor="name">Email:</label>
          <input value={email} type="email" onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input value={password} type="password" onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type="submit">Entrar</button>
        <p>Não tem cadastro? <Link to={'/register'}>cadastre-se!</Link></p>
      </form>
    </>
  )
}

export default Login