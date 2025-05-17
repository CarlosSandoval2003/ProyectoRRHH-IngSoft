import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useParams, useNavigate } from 'react-router-dom';

function NominasEmpleado() {
  const { id_empleado } = useParams();
  const navigate = useNavigate();

  const [nominas, setNominas] = useState([]);
  const [empleado, setEmpleado] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');

  useEffect(() => {
    cargarNominas();
    cargarEmpleado();
  }, [id_empleado]);

  const cargarNominas = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/nomina/nominas-empleado/${id_empleado}`);
      setNominas(res.data);
    } catch (err) {
      console.error('Error al cargar nóminas del empleado:', err);
      alert('❌ No se pudieron obtener las nóminas del empleado.');
    }
  };

  const cargarEmpleado = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/empleados/${id_empleado}`);
      setEmpleado(res.data);
    } catch (err) {
      console.error('Error al obtener empleado:', err);
    }
  };

  const filtrarNominas = () => {
    return nominas.filter(n => {
      const fecha = new Date(n.fecha_nomina);
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();
      return (
        (!filtroTipo || n.tipo_nomina === filtroTipo) &&
        (!filtroMes || mes === parseInt(filtroMes)) &&
        (!filtroAnio || anio === parseInt(filtroAnio))
      );
    });
  };

  const irADetalle = (fecha_nomina, id_tipo_nomina) => {
    const fechaLimpia = new Date(fecha_nomina).toISOString().split('T')[0];
    navigate(`/detalle-nomina/${fechaLimpia}/${id_tipo_nomina}`);
  };

  return (
    <div className="nomina-container">
      <button className="btn-volver" onClick={() => navigate('/nomina')}>⬅️ Volver</button>
      <button className="btn-volver" onClick={() => navigate('/dashboard')}>🏠 Inicio</button>
      <h2>Nóminas de {empleado ? `${empleado.nombres} ${empleado.apellidos}` : 'Empleado'}</h2>

      {/* Filtros */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="">-- Tipo --</option>
          <option value="Mensual">Mensual</option>
          <option value="Quincenal">Quincenal</option>
          <option value="Semanal">Semanal</option>
        </select>
        <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
          <option value="">-- Mes --</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <select value={filtroAnio} onChange={(e) => setFiltroAnio(e.target.value)}>
          <option value="">-- Año --</option>
          {[2023, 2024, 2025].map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <button onClick={() => {
          setFiltroTipo('');
          setFiltroMes('');
          setFiltroAnio('');
        }}>
          Limpiar Filtros
        </button>
      </div>

      {/* Tabla de Nóminas */}
      <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px' }}>Fecha de Nómina</th>
              <th style={{ padding: '10px' }}>Tipo</th>
              <th style={{ padding: '10px' }}>Estado</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filtrarNominas().map((nomina, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '10px' }}>
                  {new Date(nomina.fecha_nomina).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px' }}>{nomina.tipo_nomina}</td>
                <td style={{ padding: '10px' }}>{nomina.estado_nomina}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '6px 14px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => irADetalle(nomina.fecha_nomina, nomina.id_tipo_nomina)}
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
            {filtrarNominas().length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '15px', textAlign: 'center' }}>
                  No hay nóminas para este empleado con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NominasEmpleado;
