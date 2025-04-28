import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const opciones = [
  { nombre: 'Empleados', ruta: '/empleados', color: '#2196F3', icon: '👤' },
  { nombre: 'Nómina', ruta: '/nomina', color: '#4CAF50', icon: '💸' },
  { nombre: 'Reportes', ruta: '/reportes', color: '#FF9800', icon: '📊' },
  { nombre: 'Historial', ruta: '/historial', color: '#9C27B0', icon: '🕓' }
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>Bienvenido al Dashboard</h1>
      <div className="grid">
        {opciones.map((op, index) => (
          <div
            key={index}
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
