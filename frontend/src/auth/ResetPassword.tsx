import { RiLockPasswordFill, RiResetLeftFill } from "react-icons/ri"
import Input from "../components/form/InputForm"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import Submit from "../components/form/SubmitButton";
import { useCatchError } from "../utils/ui/useCatchError";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";

const ResetPassword = () => {

  const [processing, setProcessing] = useState<boolean>(false);

  const params = new URLSearchParams(
    window.location.search.replace(/&amp;/g, '&')
  );

  const catchError = useCatchError();
  const { showToast } = useToast();

  const navigate = useNavigate();

  const email = params.get('email');
  const token = params.get('token');
  const [newPassword, setNewPassword] = useState<string>('');
  const [repeatNewPassword, setRepeatNewPassword] = useState<string>('');

  const handleResetPassword = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (processing)return;

    if (!email || !token) {
      showToast('Link inválido ou expirado', 'error');
      return;
    }

    if (newPassword !== repeatNewPassword) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    setProcessing(true);

    try {
      const response = await api.post('/reset-password', {
        email: email,
        token: token,
        password: newPassword,
        password_confirmation: repeatNewPassword
      }, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

      showToast(response.data.message, response.data.type);
      navigate('/');
    } catch (err:unknown) {
      catchError(err);
    } finally {
      setProcessing(false);
      setNewPassword('');
      setRepeatNewPassword('');
    }
  }

  return (
    <div className="flex flex-col bg-gradient-to-bl from-cyan-100 via-white to-orange-100 text-white justify-center items-center min-h-[100dvh]">
      <div className="flex md:flex-row flex-col shadow-md p-2 w-[300px] md:max-h-fit md:h-[90dvh] bg-white border-x-8 border-double border-orange-500">
        <div className="flex flex-col md:max-w-[272px] w-full custom-scroll px-2 mr-1 overflow-y-auto">
          <h1 className="flex items-center justify-center gap-1 py-1 text-2xl text-cyan-500 font-semibold"><RiLockPasswordFill/>Nova Senha</h1>
          <form onSubmit={handleResetPassword} className="flex flex-col py-2 gap-2">
            <div className="flex flex-col gap-1 border-y-2 pt-1 pb-4 border-gray-300">
              <p className="text-cyan-600 text-xs text-justify">Digite sua nova senha.</p>
              <Input 
                fieldIcon={RiLockPasswordFill} 
                placeholderValue="Nova Senha" 
                fieldType={"password"} 
                fieldName={"Nova senha"} 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input 
                fieldIcon={RiLockPasswordFill} 
                placeholderValue="Repetir no senha" 
                fieldType={"password"} 
                fieldName={"Repetir nova senha"} 
                value={repeatNewPassword} 
                onChange={(e) => setRepeatNewPassword(e.target.value)}
              />
            </div>
            <Submit
              processing={processing}
              icon={RiResetLeftFill}
              ButtonAction={"Redefinir"}
              processingLabel="Redefinindo"
              style="bg-cyan-500 mt-[-1px] border-cyan-100 text-cyan-100"
            />
            <p className="text-center text-cyan-600 text-sm">Lembrou-se novamente? <Link className="text-blue-500 hover:underline" to={'/'}>Entre!</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword