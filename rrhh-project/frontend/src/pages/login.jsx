import { useState } from 'react';
import axios        from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate               = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/usuarios/login', {
        username,
        password
      });

      // Guardamos token y todo el usuario con su rol en localStorage
      const user = {
        username: res.data.usuario,
        rol:      res.data.rol
      };
      localStorage.setItem('token', JSON.stringify(res.data.token));
      localStorage.setItem('user',  JSON.stringify(user));

      alert(`Bienvenido ${user.username}, tu rol es: ${user.rol}`);
      navigate('/dashboard');
    } catch (err) {
      alert('Login fallido');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
