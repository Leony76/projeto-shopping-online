import { BsCheckCircleFill } from "react-icons/bs"
import { BiErrorCircle } from "react-icons/bi"
import { FiAlertTriangle } from "react-icons/fi";
import { BiInfoCircle } from "react-icons/bi";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "alert";
};

const ToastContainer = ({ toasts }: {toasts: Toast[]}) => {
  return (
    <div className="fixed top-18 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-2 text-white shadow-lg border-y-5 border-double
            ${toast.type === "success" && "bg-green-800"}
            ${toast.type === "error" && "bg-red-800"}
            ${toast.type === "info" && "bg-blue-800"}
            ${toast.type === "alert" && "bg-yellow-600"}
          `}
        >
          {toast.type === 'success' ? 
            (<p className="flex items-center gap-2"><BsCheckCircleFill size={23}/>{toast.message}</p>) : 
          toast.type === 'error' ? 
            (<p className="flex items-center gap-2"><BiErrorCircle size={25}/>{toast.message}</p>) :
          toast.type === 'alert' ?
            (<p className="flex items-center gap-2"><FiAlertTriangle size={25}/>{toast.message}</p>) :
            (<p className="flex items-center gap-2"><BiInfoCircle size={25}/>{toast.message}</p>)
          }
        </div>
      ))}
    </div>
  )
}

export default ToastContainer;