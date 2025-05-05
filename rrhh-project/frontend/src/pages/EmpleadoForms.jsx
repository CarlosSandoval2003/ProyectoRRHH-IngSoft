import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// 👉 DetalleEmpleado
export const DetalleEmpleado = () => {
    const { id } = useParams();
    const [empleado, setEmpleado] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      axios.get(`http://localhost:3001/api/empleados/${id}`)
        .then(res => setEmpleado(res.data))
        .catch(err => console.error("❌ Error al consultar:", err));
    }, [id]);
  
    if (!empleado) return <p>Cargando...</p>;
  
    const camposBonitos = {
      id_empleado: 'ID Empleado',
      nombres: 'Nombres',
      apellidos: 'Apellidos',
      dpi: 'DPI',
      email: 'Email',
      telefono: 'Teléfono',
      fecha_contratacion: 'Fecha Contratación',
      salario_base: 'Salario Base',
      dias_trabajados: 'Días Trabajados',
      nombre_puesto: 'Puesto',
      nombre_departamento: 'Departamento',
      nombre_estado: 'Estado',
    };
  
    return (
      <div className="contenedor-detalle">
        <h2>Detalle del Empleado</h2>
        <table className="tabla-detalle">
          <tbody>
            {Object.entries(empleado).map(([key, val]) => {
              if (!camposBonitos[key]) return null;
  
              // Formatear fecha si es fecha_contratacion
              if (key === 'fecha_contratacion') {
                val = new Date(val).toISOString().split('T')[0]; // Solo YYYY-MM-DD
              }
  
              return (
                <tr key={key}>
                  <td className="clave">{camposBonitos[key]}</td>
                  <td className="valor">{val}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button className="btn-volver" onClick={() => navigate('/empleados')}>🔙 Volver</button>
        </div>
      </div>
    );
  };
  
  

export const EditarEmpleado = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
  
    useEffect(() => {
      axios.get(`http://localhost:3001/api/empleados/${id}`).then((res) => {
        const empleado = res.data;
  
        // ✅ Recortar la fecha al formato YYYY-MM-DD
        if (empleado.fecha_contratacion) {
          empleado.fecha_contratacion = empleado.fecha_contratacion.substring(0, 10);
        }
  
        setForm(empleado);
      });
    }, [id]);
  
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // ✅ Validar antes de enviar (igual que en nuevo)
      if (!/^\d{13}$/.test(form.dpi)) {
        setError('❌ El DPI debe tener exactamente 13 dígitos.');
        return;
      }
  
      const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!fechaRegex.test(form.fecha_contratacion)) {
        setError('❌ La fecha debe estar en formato YYYY-MM-DD.');
        return;
      }
  
      const datos = {
        ...form,
        salario_base: parseFloat(form.salario_base),
        dias_trabajados: parseInt(form.dias_trabajados),
        id_puesto: parseInt(form.id_puesto),
        id_departamento: parseInt(form.id_departamento),
        id_estado: parseInt(form.id_estado),
      };
  
      try {
        await axios.put(`http://localhost:3001/api/empleados/${id}`, datos);
        setMensaje('✅ Empleado actualizado correctamente.');
        setError('');
        setTimeout(() => navigate('/empleados'), 1000);
      } catch (err) {
        console.error('❌ Error al actualizar:', err);
        setError('❌ Error al actualizar empleado.');
        setMensaje('');
      }
    };
  
    if (!form) return <p>Cargando...</p>;
  
    return (
      <div className="formulario-empleado">
        <h2>Editar Empleado</h2>
  
        {mensaje && <p style={{ color: 'limegreen' }}>{mensaje}</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
  
        <form onSubmit={handleSubmit}>
        {Object.entries(form).map(([key, val]) =>
  key !== 'id_empleado' ? (
    <div key={key}>
      <label>{key.replace(/_/g, ' ')}</label>
      <input
        name={key}
        type={key === 'fecha_contratacion' ? 'date' : 'text'}
        value={val}
        onChange={handleChange}
        required
      />
    </div>
  ) : null
)}

          <button type="submit">Actualizar</button>
        </form>
      </div>
    );
  };
  
  export const NuevoEmpleado = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
      nombres: '', apellidos: '', dpi: '', email: '', telefono: '',
      fecha_contratacion: '', salario_base: '', dias_trabajados: '',
      id_puesto: '', id_departamento: '', id_estado: ''
    });
  
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
  
    const [validaciones, setValidaciones] = useState({
      dpi: true,
      email: true,
      telefono: true
    });
  
    // Validación en tiempo real
    useEffect(() => {
      const verificarCamposUnicos = async () => {
        try {
          const res = await axios.get('http://localhost:3001/api/empleados');
          const lista = res.data;
  
          setValidaciones({
            dpi: !lista.some(emp => emp.dpi === form.dpi),
            email: !lista.some(emp => emp.email === form.email),
            telefono: !lista.some(emp => emp.telefono === form.telefono)
          });
        } catch (err) {
          console.error('Error al validar datos únicos:', err);
        }
      };
  
      verificarCamposUnicos();
    }, [form.dpi, form.email, form.telefono]);
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validaciones finales antes de enviar
      if (!/^\d{13}$/.test(form.dpi)) {
        setError('❌ El DPI debe tener exactamente 13 dígitos numéricos.');
        return;
      }
  
      if (!/^\d{4}-\d{2}-\d{2}$/.test(form.fecha_contratacion)) {
        setError('❌ La fecha debe tener formato YYYY-MM-DD.');
        return;
      }
  
      const camposNumericos = [
        form.salario_base,
        form.dias_trabajados,
        form.id_puesto,
        form.id_departamento,
        form.id_estado
      ];
  
      if (camposNumericos.some(campo => isNaN(campo) || campo === '')) {
        setError('❌ Algunos campos numéricos están vacíos o no son válidos.');
        return;
      }
  
      try {
        const datos = {
          ...form,
          salario_base: parseFloat(form.salario_base),
          dias_trabajados: parseInt(form.dias_trabajados),
          id_puesto: parseInt(form.id_puesto),
          id_departamento: parseInt(form.id_departamento),
          id_estado: parseInt(form.id_estado),
        };
  
        await axios.post('http://localhost:3001/api/empleados', datos);
        setMensaje('✅ Empleado registrado correctamente.');
        setError('');
        setTimeout(() => navigate('/empleados'), 1500);
      } catch (err) {
        console.error('❌ Error al registrar:', err);
        setError('❌ Error al registrar el empleado.');
        setMensaje('');
      }
    };
  
    return (
      <div className="formulario-empleado">
        <h2>Nuevo Empleado</h2>
  
        {mensaje && <p style={{ color: 'limegreen' }}>{mensaje}</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
  
        <form onSubmit={handleSubmit}>
          {Object.entries(form).map(([key, val]) => (
            <div key={key}>
              <label>{key.replace(/_/g, ' ')}</label>
              {key === 'fecha_contratacion' ? (
                <input
                  type="date"
                  name={key}
                  value={val}
                  onChange={handleChange}
                  required
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  value={val}
                  onChange={handleChange}
                  required
                />
              )}
  
              {/* Validaciones visuales en tiempo real */}
              {key === 'dpi' && !validaciones.dpi && <p className="error">❌ El DPI ya está registrado</p>}
              {key === 'email' && !validaciones.email && <p className="error">❌ El email ya está registrado</p>}
              {key === 'telefono' && !validaciones.telefono && <p className="error">❌ El teléfono ya está registrado</p>}
            </div>
          ))}
  
          <button
            type="submit"
            disabled={!validaciones.dpi || !validaciones.email || !validaciones.telefono}
          >
            Guardar
          </button>
        </form>
      </div>
    );
  };
  