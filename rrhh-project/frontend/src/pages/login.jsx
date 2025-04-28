import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/usuarios/login', {
        username,
        password
      });

      localStorage.setItem('token', res.data.token);
      alert(`Bienvenido ${res.data.usuario}, tu rol es: ${res.data.rol}`);

      // 🔁 Redirigir al dashboard
      navigate('/dashboard');

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
