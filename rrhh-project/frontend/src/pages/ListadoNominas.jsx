import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom'; // 👈 Agregado

function ListadoNominas() {
  const [nominas, setNominas] = useState([]);
  const navigate = useNavigate(); // 👈 Hook de navegación

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
  

  return (
    <div className="nomina-container">
      <button className="btn-volver" onClick={() => navigate('/nomina')}>⬅️ Volver</button>
      <h2></h2>
      <button className="btn-volver" onClick={() => navigate('/dashboard')}>🏠 Inicio</button>
      <h2>Listado de Nóminas Generadas</h2>
      <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px' }}>Fecha de Nómina</th>
              <th style={{ padding: '10px' }}>Tipo</th>
              <th style={{ padding: '10px' }}>Estado</th>
              <th style={{ padding: '10px' }}># Empleados</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {nominas.map((nomina, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '10px' }}>{nomina.fecha_nomina}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListadoNominas;
