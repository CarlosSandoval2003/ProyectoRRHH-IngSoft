import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useParams, useNavigate } from 'react-router-dom';

function DetalleNominas() {
  const { fecha_nomina, id_tipo_nomina } = useParams();
  const navigate = useNavigate();

  const [encabezado, setEncabezado] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [desgloseVisible, setDesgloseVisible] = useState(null); // 🔥 Quién está expandido
  const [detalleDesglose, setDetalleDesglose] = useState({}); // 🔥 Info de cada desglose

  const formatoQ = (valor) => `Q${parseFloat(valor || 0).toFixed(2)}`;

  useEffect(() => {
    obtenerDetalleNomina();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerDetalleNomina = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/nomina/detalle-grupo/${fecha_nomina}/${id_tipo_nomina}`
      );
      setEncabezado(response.data.encabezado);
      setEmpleados(response.data.empleados);
      setEmpleadosFiltrados(response.data.empleados);
    } catch (error) {
      console.error('Error al obtener detalle de nómina:', error);
    }
  };

  const handleBusqueda = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);

    if (valor.trim() === '') {
      setEmpleadosFiltrados(empleados);
    } else {
      const filtrados = empleados.filter((emp) =>
        emp.empleado.toLowerCase().includes(valor)
      );
      setEmpleadosFiltrados(filtrados);
    }
  };

  const toggleDesglose = async (id_nomina) => {
    if (desgloseVisible === id_nomina) {
      // 🔥 Si ya estaba abierto, ciérralo
      setDesgloseVisible(null);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/api/nomina/detalle-empleado/${id_nomina}`);
      setDetalleDesglose((prev) => ({ ...prev, [id_nomina]: response.data }));
      setDesgloseVisible(id_nomina);
    } catch (error) {
      console.error('Error al obtener desglose:', error);
    }
  };

  return (
    <div className="nomina-container">
      <h2>Detalle de Nómina</h2>

      {encabezado && (
        <div className="encabezado-nomina">
          <p><strong>📆 Fecha de Nómina:</strong> {encabezado.fecha_nomina}</p>
          <p><strong>🏷️ Tipo de Nómina:</strong> {encabezado.tipo_nomina}</p>
          <p><strong>📅 Rango:</strong> {encabezado.fecha_inicio} a {encabezado.fecha_fin}</p>
          <p><strong>📂 Estado:</strong> {encabezado.estado_nomina}</p>
          <p><strong>🏢 Departamento:</strong> {encabezado.departamento}</p>
        </div>
      )}

      {/* 🔍 Buscador */}
      <div className="barra-busqueda">
        <label htmlFor="busqueda">Buscar empleado:</label>
        <input
          type="text"
          id="busqueda"
          placeholder="Nombre o apellido"
          value={busqueda}
          onChange={handleBusqueda}
          style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
        />
      </div>

      {/* 🧾 Botones de acción */}
      <div className="botones-acciones">
        <button className="btn-pdf">🔄 Descargar PDF</button>
        <button className="btn-print">🖨️ Imprimir</button>
        <button className="btn-volver" onClick={() => navigate('/listado-nominas')}>⬅️ Volver</button>
        <button className="btn-volver" onClick={() => navigate('/dashboard')}>🏠 Inicio</button>
      </div>

      {/* 📋 Tabla de empleados */}
      <div style={{ overflowX: 'auto' }}>
        <table className="tabla-detalle">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>DPI</th>
              <th>Sueldo Base</th>
              <th>Horas Extra</th>
              <th>Prestaciones</th>
              <th>IGSS</th>
              <th>ISR</th>
              <th>Total Ingresos</th>
              <th>Total Deducciones</th>
              <th>Sueldo Neto</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {empleadosFiltrados.map((emp, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{emp.empleado}</td>
                  <td>{emp.dpi}</td>
                  <td>{formatoQ(emp.sueldo_base)}</td>
                  <td>{formatoQ(emp.horas_extra)}</td>
                  <td>{formatoQ(emp.prestaciones)}</td>
                  <td>{formatoQ(emp.igss)}</td>
                  <td>{formatoQ(emp.isr)}</td>
                  <td>{formatoQ(emp.total_ingresos)}</td>
                  <td>{formatoQ(emp.total_deducciones)}</td>
                  <td>{formatoQ(emp.salario_neto)}</td>
                  <td>
                    <button className="btn-desglose" onClick={() => toggleDesglose(emp.id_nomina)}>
                      {desgloseVisible === emp.id_nomina ? 'Ocultar' : 'Ver Desglose'}
                    </button>
                  </td>
                </tr>

                {/* Sección de desglose si está visible */}
                {desgloseVisible === emp.id_nomina && detalleDesglose[emp.id_nomina] && (
                  <tr>
                    <td colSpan="11">
                      <div className="desglose-container">
                        <h4>🧾 Detalle de Ingresos y Deducciones</h4>

                        <table className="tabla-desglose">
                          <thead>
                            <tr>
                              <th>Concepto</th>
                              <th>Monto</th>
                              <th>Tipo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detalleDesglose[emp.id_nomina].map((detalle, idx) => (
                              <tr key={idx}>
                                <td>{detalle.concepto}</td>
                                <td>{formatoQ(detalle.monto)}</td>
                                <td>{detalle.tipo}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Totales */}
                        <div className="totales-desglose">
                          <strong>Total Ingresos: </strong>
                          {formatoQ(
                            detalleDesglose[emp.id_nomina]
                              .filter(d => d.tipo === 'Ingreso')
                              .reduce((sum, d) => sum + parseFloat(d.monto), 0)
                          )}
                          <br />
                          <strong>Total Deducciones: </strong>
                          {formatoQ(
                            detalleDesglose[emp.id_nomina]
                              .filter(d => d.tipo === 'Deducción')
                              .reduce((sum, d) => sum + parseFloat(d.monto), 0)
                          )}
                          <br />
                          <strong>Salario Neto: </strong>
                          {formatoQ(
                            detalleDesglose[emp.id_nomina]
                              .filter(d => d.tipo === 'Ingreso')
                              .reduce((sum, d) => sum + parseFloat(d.monto), 0)
                            -
                            detalleDesglose[emp.id_nomina]
                              .filter(d => d.tipo === 'Deducción')
                              .reduce((sum, d) => sum + parseFloat(d.monto), 0)
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetalleNominas;
