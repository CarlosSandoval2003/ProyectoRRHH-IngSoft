// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate }        from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        console.error('Error parseando user de localStorage');
      }
    }
  }, []);

  if (!user) return null;

  const isAdmin = user.rol === 'Administrador';
  const isRH    = user.rol === 'Recursos Humanos';

  // Definimos todas las opciones posibles
  const todasOpciones = [
    { nombre: 'Empleados', ruta: '/empleados', color: '#2196F3', icon: '👤' },
    { nombre: 'Nómina',     ruta: '/nomina',    color: '#4CAF50', icon: '💸' },
    { nombre: 'Reportes',   ruta: '/reportes',  color: '#FF9800', icon: '📊' },
    { nombre: 'Historial',  ruta: '/historial', color: '#9C27B0', icon: '🕓' },
  ];

  // Construimos el array final según rol
  let opciones = [];

  if (isAdmin) {
    // Admin ve TODO + mantenimiento
    opciones = [
      ...todasOpciones,
      { nombre: 'Mantenimiento Usuarios', ruta: '/usuarios', color: '#FF5722', icon: '🛠' }
    ];
  } else if (isRH) {
    // RRHH ve todo menos 'Historial'
    opciones = todasOpciones.filter(op => op.nombre !== 'Historial');
  } else {
    // Otros roles (por si acaso) solo ven Dashboard
    opciones = [];
  }

  return (
    <div className="dashboard">
      <h1>Bienvenido, {user.username} ({user.rol})</h1>
      <div className="grid">
        {opciones.map((op, i) => (
          <div
            key={i}
            className="card"
            style={{ backgroundColor: op.color }}
            onClick={() => navigate(op.ruta)}
          >
            <div className="icon">{op.icon}</div>
            <h3>{op.nombre}</h3>
            <button className="btn">IR</button>
          </div>
        ))}
      </div>
    </div>
  );
}
