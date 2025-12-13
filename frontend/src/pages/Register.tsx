import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { register } from "../services/auth"
import { useUser } from "../context/UserContext"

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const { setUser } = useUser();

  const navigate = useNavigate();

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault();

    if (password !== repeatPassword) {
      window.alert('Senhas não se coincidem!');
      return;
    };

    try {
      const data = await register(name, email, password);

      setUser(data.user);

      navigate('/dashboard');
    } catch {
      console.log('Erro');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Cadastro</h1>
      <div>
        <label htmlFor="email">Nome:</label>
        <input value={name} type="text" onChange={(e) => setName(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input value={email} type="email" onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="password">Senha:</label>
        <input value={password} type="password" onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="password">Repetir senha:</label>
        <input value={repeatPassword} type="password" onChange={(e) => setRepeatPassword(e.target.value)}/>
      </div>
      <button type="submit">Entrar</button>
      <p>Já tem uma conta? <Link to={'/login'}>Faça Login!</Link></p>
    </form>
  );
}

export default Register