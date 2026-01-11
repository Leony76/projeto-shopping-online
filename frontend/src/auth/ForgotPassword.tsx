import { MdEmail } from "react-icons/md"
import { RiLockPasswordFill } from "react-icons/ri"
import { Link } from "react-router-dom"
import Input from "../components/form/InputForm"
import Submit from "../components/form/SubmitButton"
import { FaPaperPlane } from "react-icons/fa6"
import { useState } from "react"
import { useCatchError } from "../utils/ui/useCatchError"
import { api } from "../services/api"
import { useToast } from "../context/ToastContext"

const ForgotPassword = () => {

  const catchError = useCatchError();
  const { showToast } = useToast();

  const [processing, setProcessing] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const handleSendEmailToResetPassword = async(e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (processing) return;
    setProcessing(true);

    if (!email) {
      showToast('Insira um e-mail', 'alert');
      setProcessing(false);
      return;
    }

    try {
      const response = await api.post('/forgot-password', {
        email: email,
      });

      showToast(response.data.message);
    } catch (err:unknown) {
      catchError(err);
    } finally {
      setProcessing(false);
      setEmail('');
    }
  }

  return (
    <div className="flex flex-col bg-gradient-to-bl from-cyan-100 via-white to-orange-100 text-white justify-center items-center min-h-[100dvh]">
      <div className="flex md:flex-row flex-col shadow-md p-2 w-[300px] md:max-h-fit md:h-[90dvh] bg-white border-x-8 border-double border-orange-500">
        <div className="flex flex-col md:max-w-[272px] w-full custom-scroll px-2 mr-1 overflow-y-auto">
          <h1 className="flex items-center justify-center gap-1 py-1 text-2xl text-cyan-500 font-semibold"><RiLockPasswordFill/>Recuperar Senha</h1>
          <form onSubmit={handleSendEmailToResetPassword} className="flex flex-col py-2 gap-2">
            <div className="flex flex-col gap-1 border-y-2 pt-1 pb-4 border-gray-300">
              <p className="text-cyan-600 text-xs text-justify">Digite seu e-mail atual para que possamos lhe enviar uma mensagem com intúito poder redefinir sua senha.</p>
              <Input 
                fieldIcon={MdEmail} 
                placeholderValue="E-mail" 
                fieldType={"email"} 
                fieldName={"E-mail"} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Submit
              processing={processing}
              icon={FaPaperPlane}
              ButtonAction={"Mandar"}
              processingLabel="Mandando"
              style="bg-cyan-500 mt-[-1px] border-cyan-100 text-cyan-100"
            />
            <p className="text-center text-cyan-600 text-sm">Lembrou-se novamente? <Link className="text-blue-500 hover:underline" to={'/'}>Entre!</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword