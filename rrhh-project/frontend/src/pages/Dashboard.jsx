import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Dashboard.css';

// ✅ Renombrado para evitar conflicto
const opcionesIniciales = [
  { nombre: 'Empleados', ruta: '/empleados', color: '#2196F3', icon: '👤' },
  { nombre: 'Nómina', ruta: '/nomina', color: '#4CAF50', icon: '💸' },
  { nombre: 'Liquidaciones', ruta: '/liquidaciones', color: '#F44336', icon: '📑' },
  { nombre: 'Reportes', ruta: '/reportes', color: '#FF9800', icon: '📊' },
  { nombre: 'Historial', ruta: '/historial', color: '#9C27B0', icon: '🕓' }
];

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

  const todasOpciones = [...opcionesIniciales];
  let opciones = [];

  if (isAdmin) {
    opciones = [
      ...todasOpciones,
      { nombre: 'Mantenimiento Usuarios', ruta: '/usuarios', color: '#FF5722', icon: '🛠' }
    ];
  } else if (isRH) {
    opciones = todasOpciones.filter(op => op.nombre !== 'Historial');
  } else {
    opciones = [];
  }

  const cerrarSesion = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <h1>Bienvenido, {user.username} ({user.rol})</h1>

      <button
        onClick={cerrarSesion}
        className="btn btn-delete"
        style={{ marginBottom: '20px', backgroundColor: '#d32f2f' }}
      >
        🚪 Cerrar Sesión
      </button>

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
