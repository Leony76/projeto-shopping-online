import { 
  FaCheckCircle, 
  TbXboxXFilled,
  GoAlertFill,
} from '../assets/icons';
import { useEffect } from 'react';

type PropsType = {
  type: 'success' | 'error' | 'alert';
  message: string;
  onClose: () => void;
}

const Toast = ({type, message, onClose}:PropsType) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <div className="toast" style={{zIndex: 1000}}><p className={type === 'error' ? 'toast-error' : type === 'alert' ? 'toast-alert' : 'toast-success'}>{type === 'success' ? <FaCheckCircle size={20}/> : type === 'alert' ? <GoAlertFill size={20}/> : <TbXboxXFilled size={23}/>}{message}</p></div>
  )
}

export default Toast;