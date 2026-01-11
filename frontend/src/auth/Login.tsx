import { Link } from "react-router-dom";
import Input from "../components/form/InputForm";
import Submit from "../components/form/SubmitButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { TbLogin2 } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useCatchError } from "../utils/ui/useCatchError";
import LRC from '../assets/LericoriaFire.png';

const Login = () => {

  const { login, user } = useAuth();
  const navigate = useNavigate();

  const catchError = useCatchError();
  const { showToast } = useToast();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [processing, setProcessing] = useState<boolean>(false);

  const handleLoginSubmit = async(e:React.FormEvent) => {
    e.preventDefault();

    try {
      if (processing) return;
      setProcessing(true);
      
      if (!email) {
        showToast('Preencha o E-mail', 'alert');
        setProcessing(false);
        return
      } if (!password) {
        showToast('Preencha a Senha', 'alert');
        setProcessing(false);
        return
      }

      await login(email, password);
    } catch (err:unknown) {
      catchError(err);
    } finally {
      setPassword('');
      setProcessing(false);
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/home', {
        replace: true,
        state: {
          toast: {
            message: 'Sucesso ao fazer Login!',
            type: 'success',
          },
        },
      });
    }
  }, [user]);

  return (
    <div className="flex flex-col bg-gradient-to-bl from-cyan-100 via-white to-orange-100 text-white justify-center items-center min-h-[100dvh]">
      <div className="flex md:flex-row flex-col shadow-md p-2 md:w-[600px] w-[300px] md:max-h-[330px] md:h-[90dvh] bg-white border-x-8 border-double border-orange-500">
        <div className="flex flex-col md:max-w-[272px] w-full custom-scroll px-2 mr-1 overflow-y-auto">
          <figure className="md:hidden mt-1 self-center flex border-gray-200 flex-col h-1/3 w-1/3 justify-center items-center">
            <img className="h-1/2" style={{background: 'radial-gradient(circle, #f8ab38cb, transparent 73%)'}} src={LRC} alt="LRC" />
            <h2 className="text-orange-300 text-shadow-md text-lg italic font-bold">Lehinshopping'</h2>
          </figure>
          <h1 className="flex items-center justify-center gap-1 py-1 text-3xl text-cyan-500 font-semibold"><TbLogin2/>Login</h1>
          <form onSubmit={handleLoginSubmit} className="flex flex-col py-2 gap-2">
            <div className="flex flex-col gap-1 border-y-2 pt-1 pb-4 border-gray-300">
              <Input fieldIcon={MdEmail} placeholderValue="E-mail" fieldType={"email"} fieldName={"E-mail"} value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input fieldIcon={RiLockPasswordFill} placeholderValue="Senha" fieldType={"password"} fieldName={"Senha"} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Link className="text-blue-500 text-sm" to={'/forgot-password'}>Esqueci a senha</Link>
            <Submit
              processing={processing}
              icon={TbLogin2}
              ButtonAction={"Entrar"}
              processingLabel="Entrando"
              style="bg-cyan-500 mt-[-1px] border-cyan-100 text-cyan-100"
            />
            <p className="text-center text-cyan-600 text-sm">Não possui uma conta? <Link className="text-blue-500 hover:underline" to={'/register'}>cadastre-se!</Link></p>
          </form>
        </div>
        <figure className="md:flex border-l-2 border-gray-200 flex-col hidden w-1/2 justify-center items-center ml-2">
          <img className="h-[70%]" style={{background: 'radial-gradient(circle, #f8ab38cb, transparent 70%)'}} src={LRC} alt="LRC" />
          <h2 className="text-orange-300 text-shadow-md text-2xl italic font-bold">Lehinshopping'</h2>
        </figure>
      </div>
    </div>
  )
}

export default Login


