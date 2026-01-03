import { Link } from "react-router-dom";
import Input from "../components/form/InputForm";
import Submit from "../components/form/SubmitButton";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Login = () => {

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLoginSubmit = async(e:React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);

      navigate('/home', {
        state: {
          toast: {
            message: "Login realizado com sucesso!",
            type: "success",
          }
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showToast(error.response?.data?.message, "error");
      }
    }
  }

  useEffect(() => {
    api.get('/products')
      .then(res => console.log('API OK:', res.data))
      .catch(err => console.error('API ERRO:', err));
  }, []);

  return (
    <div className="flex flex-col bg-[black] text-white justify-center items-center min-h-screen">
      <div className="flex flex-col p-2 w-[300px] border-1 rounded-lg">
        <h1 className="text-center text-2xl font-semibold border-b-1 border-b-white pb-3">Login</h1>
        <form onSubmit={handleLoginSubmit} className="flex flex-col py-3 gap-2">
          <Input fieldType={"email"} fieldName={"E-mail"} value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input fieldType={"password"} fieldName={"Senha"} value={password} onChange={(e) => setPassword(e.target.value)} />
          <Submit ButtonAction={"Entrar"}/>
          <p className="text-center text-sm">Não tem conta? <Link className="text-blue-500 hover:underline" to={'/register'}>cadastre-se!</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Login


