import { Link } from "react-router-dom";
import Input from "../components/form/InputForm";
import Submit from "../components/form/SubmitButton";
import { useState } from "react";
import { getCsrf } from "../services/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {

  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");

  const handleRegisterSumbit = async(e:React.FormEvent) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      alert('Senhas se coincidem!');
      return;
    }

    try {
      await getCsrf();
      await register(name, email, password);

      navigate('/home', {
        state: {
          toast: {
            message: 'Sucesso ao se registrar!',
            type: 'success',
          }
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message);
      }
    }
  }

  return (
    <div className="flex flex-col bg-[black] text-white justify-center items-center min-h-screen">
      <div className="flex flex-col p-2 w-[300px] border-1 rounded-lg">
        <h1 className="text-center text-2xl font-semibold border-b-1 border-b-white pb-3">Cadastro</h1>
        <form onSubmit={handleRegisterSumbit} className="flex flex-col py-3 gap-2">
          <Input fieldType={"text"} fieldName={"Nome"} onChange={(e) => setName(e.target.value)} value={name}/>
          <Input fieldType={"email"} fieldName={"E-mail"} onChange={(e) => setEmail(e.target.value)} value={email}/>
          <Input fieldType={"password"} fieldName={"Senha"} onChange={(e) => setPassword(e.target.value)} value={password}/>
          <Input fieldType={"password"} fieldName={"Repetir senha"} onChange={(e) => setRepeatPassword(e.target.value)} value={repeatPassword}/>
          <Submit ButtonAction={"Cadastrar"}/>
        </form>
        <p className="text-center">Já tem cadastro? <Link className="text-blue-500 hover:underline" to={'/'}>Entre!</Link></p>
      </div>
    </div>
  )
}

export default Register