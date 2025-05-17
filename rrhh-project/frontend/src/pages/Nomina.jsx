import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './Dashboard.css';

function Nomina() {
  const [departamentos, setDepartamentos] = useState([]);
  const [tiposNomina, setTiposNomina] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('all');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormularioMasivo, setMostrarFormularioMasivo] = useState(false);
  const [tipoNominaSeleccionado, setTipoNominaSeleccionado] = useState('');
  const [depMasivo, setDepMasivo] = useState('');
  const mostrarColumnaDepartamento = departamentoSeleccionado === 'all';
  const [fechaNomina, setFechaNomina] = useState('');
  const navigate = useNavigate();
  const [mostrarFormularioIndividual, setMostrarFormularioIndividual] = useState(false);
const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
const [fechaNominaIndividual, setFechaNominaIndividual] = useState('');
const [tipoNominaIndividual, setTipoNominaIndividual] = useState('');
const verNominasEmpleado = (id_empleado) => {
  navigate(`/nominas-empleado/${id_empleado}`);
};


  useEffect(() => {
    obtenerDepartamentos();
    obtenerTiposNomina();
    obtenerEmpleados();
  }, []);

  const obtenerDepartamentos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/nomina/departamentos');
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error al obtener departamentos:', error);
    }
  };

  const abrirFormularioIndividual = (empleado) => {
  setEmpleadoSeleccionado(empleado);
  setFechaNominaIndividual('');
  setTipoNominaIndividual('');
  setMostrarFormularioIndividual(true);
};

const generarNominaEmpleado = async () => {
  try {
    const fecha = new Date(fechaNominaIndividual);
    const [anio, mes] = fechaNominaIndividual.split('-').map(Number);


    const payload = {
  id_empleado: empleadoSeleccionado.id_empleado,
  fecha_nomina: fechaNominaIndividual,
  id_tipo_nomina: tipoNominaIndividual,
  id_estado: 1,
  mes: mes,
  anio: anio,
  id_departamento: empleadoSeleccionado.id_departamento // <-- ¡ESTO ES LO NUEVO!
};


    await axios.post('http://localhost:3001/api/nomina/generar-empleado', payload);
    alert('✅ Nómina generada para el empleado.');
    setMostrarFormularioIndividual(false);
    setEmpleadoSeleccionado(null);
    obtenerEmpleados();
  } catch (error) {
    console.error('❌ Error al generar nómina individual:', error.response?.data?.message || error.message);
    alert('❌ Ocurrió un error al generar la nómina.');
  }
};


  const obtenerTiposNomina = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/nomina/tipos-nomina');
      setTiposNomina(response.data);
    } catch (error) {
      console.error('Error al obtener tipos de nómina:', error);
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/nomina/empleados');
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  const handleDepartamentoChange = async (e) => {
    const id = e.target.value;
    setDepartamentoSeleccionado(id);
    setBusqueda('');

    try {
      if (id === 'all') {
        obtenerEmpleados();
      } else if (id === '') {
        setEmpleados([]);
      } else {
        const response = await axios.get(`http://localhost:3001/api/nomina/empleados/${id}`);
        setEmpleados(response.data);
      }
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  const handleBusqueda = async (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setDepartamentoSeleccionado('');

    if (valor.trim() === '') {
      obtenerEmpleados();
    } else {
      try {
        const response = await axios.get(`http://localhost:3001/api/nomina/buscar/${valor}`);
        setEmpleados(response.data);
      } catch (error) {
        console.error('Error en búsqueda:', error);
      }
    }
  };

  

  const toggleFormularioMasivo = () => {
    setMostrarFormularioMasivo(!mostrarFormularioMasivo);
    setDepMasivo('');
    setTipoNominaSeleccionado('');
  };

  const generarNominaMasiva = async () => {
  try {
    const fecha = new Date(fechaNomina);
    const [anio, mes] = fechaNomina.split('-').map(Number);


    const payload = {
      fecha_nomina: fechaNomina,
      id_tipo_nomina: tipoNominaSeleccionado,
      id_estado: 1,
      mes: mes,
      anio: anio,
      id_departamento: depMasivo === 'all' ? null : depMasivo
    };

    if (depMasivo === 'all') {
      await axios.post('http://localhost:3001/api/nomina/generar-masivo', payload);
      alert('✅ Nómina generada para todos los empleados.');
    } else {
      await axios.post('http://localhost:3001/api/nomina/generar-departamento', payload);
      alert('✅ Nómina generada para el departamento.');
    }

    setMostrarFormularioMasivo(false);
    setDepMasivo('');
    setTipoNominaSeleccionado('');
    setFechaNomina('');
    obtenerEmpleados();

  } catch (error) {
    console.error('❌ Error al generar nómina:', error.response?.data?.message || error.message);
    alert('❌ Ocurrió un error al generar la nómina.');
  }
};

  

  return (
    <div className="nomina-container">
      <button className="btn-volver" onClick={() => navigate('/dashboard')}>⬅️ Volver</button>
      <h2></h2>
      <button className="btn-volver" onClick={() => navigate('/dashboard')}>🏠 Inicio</button>
      <h2>Generación de Nóminas</h2>

      {/* Barra de búsqueda */}
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

      {/* Selector de departamentos */}
      <div className="filtro-departamento">
        <label htmlFor="departamento">Selecciona un departamento:</label>
        <select
          id="departamento"
          value={departamentoSeleccionado}
          onChange={handleDepartamentoChange}
        >
          <option value="all">Todos los Departamentos</option>
          {departamentos.map((dep) => (
            <option key={dep.id_departamento} value={dep.id_departamento}>
              {dep.nombre_departamento}
            </option>
          ))}
        </select>
      </div>

      {/* Botones de acción masiva */}
      <div style={{ marginTop: '15px', marginBottom: '25px', display: 'flex', gap: '15px' }}>
        <button
          style={{
            backgroundColor: '#007BFF',
            color: 'white',
            padding: '8px 18px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={toggleFormularioMasivo}
        >
          {mostrarFormularioMasivo ? 'Ocultar Formulario Masivo' : 'Generar Nómina Masiva'}
        </button>

        <button
  style={{
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '8px 18px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }}
  onClick={() => navigate('/listado-nominas')}
>
  Ver Nóminas Generadas
</button>
      </div>

      {/* Formulario de Nómina Masiva */}
      {mostrarFormularioMasivo && (
        <div style={{ background: '#222', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
          <h4>Generar Nómina Masiva</h4>

          <div style={{ marginBottom: '15px' }}>
            <label>Departamento:</label>
            <select
              value={depMasivo}
              onChange={(e) => setDepMasivo(e.target.value)}
              style={{ marginLeft: '10px' }}
            >
              <option value="">-- Selecciona --</option>
              <option value="all">Todos los Departamentos</option>
              {departamentos.map((dep) => (
                <option key={dep.id_departamento} value={dep.id_departamento}>
                  {dep.nombre_departamento}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Tipo de Nómina:</label>
            <select
              value={tipoNominaSeleccionado}
              onChange={(e) => setTipoNominaSeleccionado(e.target.value)}
              style={{ marginLeft: '10px' }}
            >
              <option value="">-- Selecciona --</option>
              {tiposNomina.map((tipo) => (
                <option key={tipo.id_tipo_nomina} value={tipo.id_tipo_nomina}>
                  {tipo.tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Campo para seleccionar la fecha de nómina */}
<div style={{ marginBottom: '15px' }}>
  <label>Fecha de la Nómina:</label>
  <input
  type="month"
  value={fechaNomina}
  onChange={(e) => setFechaNomina(e.target.value)}
  style={{ marginLeft: '10px', padding: '5px' }}
/>


</div>


<button
  disabled={depMasivo === '' || tipoNominaSeleccionado === '' || fechaNomina === ''}
  onClick={generarNominaMasiva}
  style={{
    backgroundColor:
      depMasivo === '' || tipoNominaSeleccionado === '' || fechaNomina === ''
        ? '#888'
        : '#28a745',
    color: 'white',
    padding: '8px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor:
      depMasivo === '' || tipoNominaSeleccionado === '' || fechaNomina === ''
        ? 'not-allowed'
        : 'pointer'
  }}
>
  Generar Nómina
</button>

        </div>
      )}

      {/* Tabla de empleados */}
      <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px' }}>Nombre</th>
              <th style={{ padding: '10px' }}>DPI</th>
              <th style={{ padding: '10px' }}>Puesto</th>
              {mostrarColumnaDepartamento && <th style={{ padding: '10px' }}>Departamento</th>}
              <th style={{ padding: '10px', textAlign: 'center' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id_empleado} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '10px' }}>{empleado.nombre_completo}</td>
                <td style={{ padding: '10px' }}>{empleado.dpi}</td>
                <td style={{ padding: '10px' }}>{empleado.puesto}</td>
                {mostrarColumnaDepartamento && (
                  <td style={{ padding: '10px' }}>{empleado.departamento}</td>
                )}
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '6px 14px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => verNominasEmpleado(empleado.id_empleado)}
                  >
                    Ver Nómina
                  </button>
                  <button
    style={{
      backgroundColor: '#ffc107',
      color: 'black',
      padding: '6px 14px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }}
    onClick={() => abrirFormularioIndividual(empleado)}
  >
    Crear Nómina
  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mostrarFormularioIndividual && (
  <div style={{ background: '#333', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
    <h4>Generar Nómina para {empleadoSeleccionado.nombre_completo}</h4>

    <div style={{ marginBottom: '15px' }}>
      <label>Tipo de Nómina:</label>
      <select
        value={tipoNominaIndividual}
        onChange={(e) => setTipoNominaIndividual(e.target.value)}
        style={{ marginLeft: '10px' }}
      >
        <option value="">-- Selecciona --</option>
        {tiposNomina.map((tipo) => (
          <option key={tipo.id_tipo_nomina} value={tipo.id_tipo_nomina}>
            {tipo.tipo}
          </option>
        ))}
      </select>
    </div>

    <div style={{ marginBottom: '15px' }}>
      <label>Fecha de Nómina:</label>
      <input
  type="month"
  value={fechaNominaIndividual}
  onChange={(e) => setFechaNominaIndividual(e.target.value)}
  style={{ marginLeft: '10px', padding: '5px' }}
/>

    </div>

    <button
      disabled={tipoNominaIndividual === '' || fechaNominaIndividual === ''}
      onClick={generarNominaEmpleado}
      style={{
        backgroundColor:
          tipoNominaIndividual === '' || fechaNominaIndividual === ''
            ? '#888'
            : '#28a745',
        color: 'white',
        padding: '8px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor:
          tipoNominaIndividual === '' || fechaNominaIndividual === ''
            ? 'not-allowed'
            : 'pointer'
      }}
    >
      Generar Nómina
    </button>

    <button
      onClick={() => setMostrarFormularioIndividual(false)}
      style={{
        marginLeft: '10px',
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '8px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Cancelar
    </button>
  </div>
)}

    </div>
  );
}

export default Nomina;
