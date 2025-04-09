import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/usuarios/login', {
        username,
        password
      });
      console.log(res.data);
      alert(`Bienvenido ${res.data.username}`);
    } catch (err) {
      alert('Login fallido');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <input type="text" placeholder="Usuario" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
