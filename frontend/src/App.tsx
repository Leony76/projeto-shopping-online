import { useEffect, useState } from 'react'
import './App.css'
import { api } from './services/api'

function App() {
  const [msg, setMsg] = useState<string>('');

    useEffect(() => {
    api.get('/teste')
      .then(res => {
        console.log('Resposta:', res.data);
        setMsg(res.data.message);
      })
      .catch(err => {
        console.error('Erro:', err);
      });
  }, []);


  return (
    <>
      <p>{msg}</p>
    </>
  )
}

export default App
