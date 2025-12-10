type PropsType = {
  type: 'success' | 'error';
  message: string;
}

const Toast = ({type, message}:PropsType) => {
  return (
    <div className="toast"><p className={type === 'error' ? 'toast-error' : 'toast-success'}>{message}</p></div>
  )
}

export default Toast