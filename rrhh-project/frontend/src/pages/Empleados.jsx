import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Empleados.css';

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/empleados')
      .then(res => setEmpleados(res.data));
  }, []);

const eliminarEmpleado = async (id) => {
  const { isConfirmed, isDismissed, value } = await Swal.fire({
    title: '¿Deseas generar la indemnización?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Sí',
    denyButtonText: 'No',
    cancelButtonText: 'Cancelar',
  });

  if (isDismissed) return; // cancelado

  if (value) {
    if (value) {
  try {
    const fechaHoy = new Date().toISOString().split('T')[0];
    await axios.post(`http://localhost:3001/api/indemnizacion/generar/${id}`, {
      fecha_despido: fechaHoy
    });

    await axios.delete(`http://localhost:3001/api/empleados/${id}`);
    Swal.fire('✅ Indemnización generada', 'El empleado fue inactivado y su liquidación calculada.', 'success');
    navigate('/liquidaciones');
  } catch (err) {
    console.error('❌ Error generando liquidación:', err);
    Swal.fire('❌ Error', err.response?.data?.error || 'No se pudo generar la liquidación.', 'error');
  }
}


  }

  if (isConfirmed === false) {
    // Si elige "No", inactivar empleado
    try {
      await axios.delete(`http://localhost:3001/api/empleados/${id}`);
      setEmpleados(empleados.filter(e => e.id_empleado !== id));
      Swal.fire('✅ Empleado inactivado', '', 'success');
    } catch (err) {
      console.error('❌ Error al cambiar estado del empleado:', err);
      Swal.fire('❌ Error al inactivar', 'No se pudo actualizar el estado del empleado.', 'error');
    }
  }
};


  const empleadosFiltrados = empleados.filter(e =>
    e.nombre_completo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="contenedor-empleados">
      <div className="botonera-superior">
      <button className="btn volver" onClick={() => navigate('/dashboard')}>🔙 Volver</button>
        <button className="btn inicio" onClick={() => navigate('/dashboard')}>🏠 Inicio</button>
      </div>

      <h2 className="titulo">Gestión de Empleados</h2>

      <button className="btn-nuevo" onClick={() => navigate('/empleados/nuevo')}>
        ➕ Nuevo Empleado
      </button>

      <input
        type="text"
        className="input-busqueda"
        placeholder="Buscar por nombre o apellido..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <table className="tabla-empleados">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DPI</th>
            <th>Puesto</th>
            <th>Departamento</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {empleadosFiltrados.map(e => (
            <tr key={e.id_empleado}>
              <td>{e.nombre_completo}</td>
              <td>{e.dpi}</td>
              <td>{e.nombre_puesto}</td>
              <td>{e.nombre_departamento}</td>
              <td>{e.email}</td>
              <td>{e.telefono}</td>
              <td>
                <div className="acciones">
                  <button onClick={() => navigate(`/empleados/${e.id_empleado}`)}>Ver</button>
                  <button onClick={() => navigate(`/empleados/editar/${e.id_empleado}`)}>Editar</button>
                  <button onClick={() => eliminarEmpleado(e.id_empleado)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
