import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Empleados.css';

export default function DetalleEmpleado() {
  const { id } = useParams();
  const [empleado, setEmpleado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/api/empleados/${id}`)
      .then(res => setEmpleado(res.data))
      .catch(err => {
        console.error("❌ Error al obtener empleado:", err);
      });
  }, [id]);

  if (!empleado) return <p style={{ color: 'white' }}>Cargando datos...</p>;

  return (
    <div className="contenedor-empleados">
      <div className="botonera-superior">
        <button className="btn" disabled>🛠 Gestionar Horas Extra</button><br />
        <button className="btn volver" onClick={() => navigate(-1)}>🔙 Volver</button>
      </div>

      <h2 className="titulo">Detalle del Empleado</h2>

      <table className="tabla-detalle">
        <tbody>
          {Object.entries(empleado).map(([key, value]) => (
            <tr key={key}>
              <td className="campo">{key.replace(/_/g, ' ')}</td>
              <td className="valor">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
