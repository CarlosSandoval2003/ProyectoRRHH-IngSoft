import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

function ListadoNominas() {
  const [nominas, setNominas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');


  useEffect(() => {
    obtenerListadoNominas();
  }, []);

  const obtenerListadoNominas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/nomina/listado-nominas');
      setNominas(response.data);
    } catch (error) {
      console.error('Error al obtener el listado de nóminas:', error);
    }
  };

  const irADetalle = (fecha_nomina, tipo_nomina) => {
    const fechaLimpia = new Date(fecha_nomina).toISOString().split('T')[0];
    navigate(`/detalle-nomina/${fechaLimpia}/${tipo_nomina}`);
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

  const buscarPorEmpleado = async () => {
  try {
    if (!busqueda.trim()) {
      obtenerListadoNominas();
      return;
    }

    const response = await axios.get(`http://localhost:3001/api/nomina/buscar-nominas/${busqueda}`);
    setNominas(response.data);
  } catch (err) {
    console.error('Error al buscar nóminas por empleado:', err);
    alert('No se encontraron nóminas para ese empleado.');
  }
};


  return (
    <div className="nomina-container">
      <button className="btn-volver" onClick={() => navigate('/nomina')}>⬅️ Volver</button>
      <h2></h2>
      <button className="btn-volver" onClick={() => navigate('/dashboard')}>🏠 Inicio</button>
      <h2>Listado de Nóminas Generadas</h2>
    <input
  type="text"
  placeholder="Buscar por nombre o DPI"
  value={busqueda}
  onChange={(e) => setBusqueda(e.target.value)}
  style={{ padding: '8px', flex: 1 }}
/>
<button onClick={buscarPorEmpleado}>Buscar</button>

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
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>
        <select value={filtroAnio} onChange={(e) => setFiltroAnio(e.target.value)}>
          <option value="">-- Año --</option>
          {[2023, 2024, 2025].map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <button onClick={() => { setFiltroTipo(''); setFiltroMes(''); setFiltroAnio(''); }}>
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
              <th style={{ padding: '10px' }}># Empleados</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Detalle</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Eliminar</th>
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
                <td style={{ padding: '10px' }}>{nomina.empleados_incluidos}</td>
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
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      padding: '6px 14px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'not-allowed' // decorativo por ahora
                    }}
                    disabled
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filtrarNominas().length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '15px', textAlign: 'center' }}>
                  No hay nóminas que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListadoNominas;
