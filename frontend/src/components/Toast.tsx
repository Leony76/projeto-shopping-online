import { 
  FaCheckCircle, 
  TbXboxXFilled,
  GoAlertFill,
} from '../assets/icons';

type PropsType = {
  type: 'success' | 'error' | 'alert';
  message: string;
}

const Toast = ({type, message}:PropsType) => {
  return (
    <div className="toast"><p className={type === 'error' ? 'toast-error' : type === 'alert' ? 'toast-alert' : 'toast-success'}>{type === 'success' ? <FaCheckCircle size={20}/> : type === 'alert' ? <GoAlertFill size={20}/> : <TbXboxXFilled size={23}/>}{message}</p></div>
  )
}

export default Toast