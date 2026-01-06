import { Link } from "react-router-dom";
import Input from "../components/form/InputForm";
import Submit from "../components/form/SubmitButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaFileSignature, FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import LRC from '../assets/LericoriaFire.png';
import '../css/scrollbar.css';
import { useCatchError } from "../utils/ui/useCatchError";
import { useToast } from "../context/ToastContext";

const Register = () => {

  const { register, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const catchError = useCatchError();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");

  const [processing, setProcessing] = useState<boolean>(false);

  const handleRegisterSumbit = async(e:React.FormEvent) => {
    e.preventDefault();

    if (!name) {showToast('Preencha o Nome', 'alert'); return;};
    if (!email) {showToast('Preencha o E-mail', 'alert'); return;};
    if (!password) {showToast('Preencha a Senha', 'alert'); return;};
    if (!repeatPassword) {showToast('Preencha o campo de "repetir senha"', 'alert'); return;};

    if (password !== repeatPassword) {
      showToast('Senhas não se coincidem!', 'error');
      return;
    }

    try {
      if (processing) return;
      setProcessing(true);

      await register(name, email, password);
    } catch (err:unknown) {
      catchError(err);
    } finally {
      setProcessing(false);
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/home', {
        replace: true,
        state: {
          toast: {
            message: 'Sucesso ao se cadastrar!',
            type: 'success',
          },
        },
      });
    }
  }, [user]);

  return (
    <div className="flex flex-col bg-gradient-to-tr from-cyan-100 via-white to-orange-100 justify-center items-center min-h-[100dvh] px-2">
      <div className="flex md:flex-row flex-col shadow-md p-2 md:max-w-[650px] max-w-[300px] md:max-h-[438px] h-full w-full md:h-[90dvh] bg-white border-x-8 border-double border-orange-500">
        <div className="flex flex-col md:max-w-[272px] w-full custom-scroll px-2 mr-1 overflow-y-auto">
          <figure className="md:hidden mt-1 self-center flex border-gray-200 flex-col h-1/3 w-1/3 justify-center items-center">
            <img className="h-1/2" style={{background: 'radial-gradient(circle, #f8ab38cb, transparent 73%)'}} src={LRC} alt="LRC" />
            <h2 className="text-orange-300 text-shadow-md text-lg italic font-bold">Lehinshopping'</h2>
          </figure>
          <h1 className="flex items-center justify-center gap-1 py-1 text-3xl text-orange-500 font-semibold"><FaFileSignature/>Cadastrar</h1>
          <form onSubmit={handleRegisterSumbit} className="flex flex-col py-3 gap-2">
            <div className="flex flex-col gap-1 border-y-2 pt-1 pb-4 border-gray-300 border-black">
              <Input placeholderValue="Nome" fieldIcon={FaUser} fieldType={"text"} fieldName={"Nome"} onChange={(e) => setName(e.target.value)} value={name}/>
              <Input placeholderValue="E-mail" fieldIcon={MdEmail} fieldType={"email"} fieldName={"E-mail"} onChange={(e) => setEmail(e.target.value)} value={email}/>
              <Input placeholderValue="Senha" fieldIcon={RiLockPasswordFill} fieldType={"password"} fieldName={"Senha"} onChange={(e) => setPassword(e.target.value)} value={password}/>
              <Input placeholderValue="Repetir Senha" fieldIcon={RiLockPasswordLine} fieldType={"password"} fieldName={"Repetir senha"} onChange={(e) => setRepeatPassword(e.target.value)} value={repeatPassword}/>
            </div>
            <Submit
              processing={processing}
              ButtonAction={"Cadastrar"}
              icon={FaFileSignature}
              processingLabel={"Cadastrando"}
              style="bg-orange-500 border-orange-100 text-orange-100"
            />
            <p className="text-center text-orange-600 text-sm">Já possui cadastro? <Link className="text-blue-500 hover:underline" to={'/'}>Entre!</Link></p>
          </form>
        </div>
        <figure className="md:flex border-l-2 border-gray-200 flex-col hidden h-full w-[55%] justify-center items-center ml-2">
          <img className="h-[70%]" style={{background: 'radial-gradient(circle, #f8ab38cb, transparent 73%)'}} src={LRC} alt="LRC" />
          <h2 className="text-orange-300 text-shadow-md text-2xl italic font-bold">Lehinshopping'</h2>
        </figure>
      </div>
    </div>
  )
}

export default Register