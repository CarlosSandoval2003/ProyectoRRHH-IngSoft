import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// 👉 DetalleEmpleado
export const DetalleEmpleado = () => {
    const { id } = useParams();
    const [empleado, setEmpleado] = useState(null);
    const [horasExtras, setHorasExtras] = useState(null);
    const [mostrarHoras, setMostrarHoras] = useState(false);
const [listadoHoras, setListadoHoras] = useState([]);
const [fechaNueva, setFechaNueva] = useState('');
const [horasNueva, setHorasNueva] = useState('');
const [totalHoras, setTotalHoras] = useState(0);
const [mostrarDias, setMostrarDias] = useState(false);
const [diasSeleccionados, setDiasSeleccionados] = useState([]);
const [todosLosDias, setTodosLosDias] = useState([]);


const obtenerHistorialHoras = async () => {
  try {
    const res = await axios.get(`http://localhost:3001/api/empleados/horasextras/listar/${id}`);
    setListadoHoras(res.data);
    const total = res.data.reduce((sum, h) => sum + h.horas, 0);
    setTotalHoras(total);
  } catch (err) {
    console.error('❌ Error al obtener historial:', err);
  }
};

const toggleDia = (fecha) => {
  if (diasSeleccionados.includes(fecha)) {
    setDiasSeleccionados(diasSeleccionados.filter(f => f !== fecha));
  } else {
    setDiasSeleccionados([...diasSeleccionados, fecha]);
  }
};

const guardarDiasTrabajados = async () => {
  try {
    await axios.post(`http://localhost:3001/api/empleados/diastrabajados/${id}`, {
      fechas: diasSeleccionados
    });
    alert("✅ Días trabajados guardados correctamente.");
    setMostrarDias(false);
  } catch (err) {
    console.error("❌ Error al guardar días trabajados:", err);
    alert("❌ Ocurrió un error al guardar.");
  }
};


const agregarHoraExtra = async () => {
  try {
    await axios.post(`http://localhost:3001/api/empleados/horasextras/insertar/${id}`, {
      fecha: fechaNueva,
      horas: parseInt(horasNueva),
    });
    await obtenerHistorialHoras();
    setFechaNueva('');
    setHorasNueva('');
  } catch (err) {
    alert("❌ Error: " + err.response.data.error);
  }
};

    const navigate = useNavigate();
  
    useEffect(() => {
      axios.get(`http://localhost:3001/api/empleados/${id}`)
        .then(res => setEmpleado(res.data))
        .catch(err => console.error("❌ Error al consultar:", err));
        axios.get(`http://localhost:3001/api/empleados/horasextras/${id}`)
        .then(res => setHorasExtras(res.data?.horas_extras_mes ?? 0))
        .catch(err => console.error("❌ Error al obtener horas extras:", err));
    }, [id]);

    useEffect(() => {
      if (mostrarDias) {
        const cargarDias = async () => {
          try {
            // 1. Días ya registrados
            const res = await axios.get(`http://localhost:3001/api/empleados/diastrabajados/${id}`);
            setDiasSeleccionados(res.data);
    
            // 2. Generar todos los días del mes actual
            const hoy = new Date();
            const year = hoy.getFullYear();
            const month = hoy.getMonth();
            const diasMes = new Date(year, month + 1, 0).getDate();
            const fechas = [];
    
            for (let dia = 1; dia <= diasMes; dia++) {
              const fecha = new Date(year, month, dia).toISOString().split('T')[0];
              fechas.push(fecha);
            }
    
            setTodosLosDias(fechas);
          } catch (err) {
            console.error("❌ Error al cargar días trabajados:", err);
          }
        };
    
        cargarDias();
      }
    }, [mostrarDias, id]);
    
    
  
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
      nombre_puesto: 'Puesto',
      nombre_departamento: 'Departamento',
      nombre_estado: 'Estado',
    };
  
    return (
      <div className="contenedor-detalle">
        <button className="btn volver" onClick={() => navigate('/empleados')}>🔙 Volver</button>
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
            <tr>
            <td className="clave">Horas Extras del Mes</td>
            <td className="valor">
              {horasExtras} &nbsp;horas
            </td>
          </tr>
          </tbody>
        </table>
        <div style={{ marginBottom: '10px', textAlign: 'center' }}>
  <button className="btn-volver" onClick={() => {
    setMostrarHoras(!mostrarHoras);
    if (!mostrarHoras) obtenerHistorialHoras();
  }}>
    🛠 Gestionar Horas Extra
  </button>
</div>
{mostrarHoras && (
  <div className="panel-horas-extra">
    <h3>Horas Extra del Empleado</h3>
    <p><strong>Mes:</strong> {new Date().toLocaleString('default', { month: 'long' }).toUpperCase()}</p>

    <table className="tabla-horas-extra">
      <thead>
        <tr><th>Fecha</th><th>Horas</th><th>Monto por Hora</th></tr>
      </thead>
      <tbody>
        {listadoHoras.map((hx, i) => (
          <tr key={i}>
            <td>{hx.fecha}</td>
            <td>{hx.horas}</td>
            <td>Q {parseFloat(hx.montoporhora).toFixed(2)}</td>
          </tr>
        ))}
        <tr style={{ fontWeight: 'bold' }}>
          <td colSpan={1}>Total</td>
          <td>{totalHoras}</td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <h4>Añadir Horas Extra</h4>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '10px' }}>
      <input type="date" value={fechaNueva} onChange={(e) => setFechaNueva(e.target.value)} />
      <input type="number" placeholder="Horas" value={horasNueva} onChange={(e) => setHorasNueva(e.target.value)} />
    </div>
    <button onClick={agregarHoraExtra}>➕ Agregar Horas Extra</button>

    <div style={{ marginTop: '10px' }}>
      <button className="btn-volver" onClick={() => setMostrarHoras(false)}>❌ Salir</button>
    </div>
  </div>
)}

{mostrarDias && (
  <div className="panel-horas-extra">
    <h3>Días Trabajados del Empleado</h3>
    <p><strong>Mes:</strong> {new Date().toLocaleString('default', { month: 'long' }).toUpperCase()}</p>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
      {todosLosDias.map(fecha => (
        <label key={fecha} style={{ minWidth: '120px' }}>
          <input
            type="checkbox"
            checked={diasSeleccionados.includes(fecha)}
            onChange={() => toggleDia(fecha)}
          />
          {fecha}
        </label>
      ))}
    </div>

    <div style={{ marginTop: '10px' }}>
      <button onClick={guardarDiasTrabajados}>💾 Guardar Cambios</button>
      <button className="btn-volver" onClick={() => setMostrarDias(false)} style={{ marginLeft: '10px' }}>
        ❌ Cancelar
      </button>
    </div>
  </div>
)}


<div style={{ marginBottom: '10px', textAlign: 'center' }}>
  <button className="btn-volver" onClick={() => setMostrarDias(!mostrarDias)}>
    🛠 Gestionar Días Trabajados
  </button>
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
    const [departamentos, setDepartamentos] = useState([]);
    const [puestosFiltrados, setPuestosFiltrados] = useState([]);
    const [estados, setEstados] = useState([]);

  
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

    useEffect(() => {
      if (!form?.id_departamento) return;
    
      const cargarPuestos = async () => {
        try {
          const res = await axios.get(`http://localhost:3001/api/empleados/puestos/${form.id_departamento}`);
          setPuestosFiltrados(res.data);
        } catch (err) {
          console.error("❌ Error al cargar puestos:", err);
        }
      };
    
      cargarPuestos();
    }, [form?.id_departamento]);
    

    useEffect(() => {
      const cargarDatos = async () => {
        try {
          const resDeps = await axios.get('http://localhost:3001/api/empleados/departamentos');
          const resEstados = await axios.get('http://localhost:3001/api/empleados/estados');
          setDepartamentos(resDeps.data);
          setEstados(resEstados.data);
        } catch (err) {
          console.error("❌ Error al cargar selects:", err);
        }
      };
    
      cargarDatos();
    }, []);

    useEffect(() => {
      const cargarPuestosPorDepartamento = async () => {
        if (!form?.id_departamento) return;
        try {
          const res = await axios.get(`http://localhost:3001/api/empleados/puestos/${form.id_departamento}`);
          setPuestosFiltrados(res.data);
        } catch (err) {
          console.error("❌ Error al cargar puestos:", err);
        }
      };
    
      cargarPuestosPorDepartamento();
    }, [form?.id_departamento]);
    
    
  
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
        <button className="btn volver" onClick={() => navigate('/empleados')}>🔙 Volver</button>
        <h2>Editar Empleado</h2>
  
        {mensaje && <p style={{ color: 'limegreen' }}>{mensaje}</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
  
        <form onSubmit={handleSubmit}>
  <div>
    <label>Nombres</label>
    <input name="nombres" value={form.nombres} onChange={handleChange} required />
  </div>

  <div>
    <label>Apellidos</label>
    <input name="apellidos" value={form.apellidos} onChange={handleChange} required />
  </div>

  <div>
    <label>DPI</label>
    <input name="dpi" value={form.dpi} onChange={handleChange} required />
  </div>

  <div>
    <label>Email</label>
    <input name="email" value={form.email} onChange={handleChange} required />
  </div>

  <div>
    <label>Teléfono</label>
    <input name="telefono" value={form.telefono} onChange={handleChange} required />
  </div>

  <div>
    <label>Fecha de Contratación</label>
    <input type="date" name="fecha_contratacion" value={form.fecha_contratacion} onChange={handleChange} required />
  </div>

  <div>
    <label>Salario Base</label>
    <input name="salario_base" type="number" value={form.salario_base} onChange={handleChange} required />
  </div>

  <div>
    <label>Departamento</label>
    <select name="id_departamento" value={form.id_departamento} onChange={handleChange} required>
      <option value="">Seleccione un departamento</option>
      {departamentos.map(dep => (
        <option key={dep.id_departamento} value={dep.id_departamento}>
          {dep.nombre_departamento}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label>Puesto</label>
    <select name="id_puesto" value={form.id_puesto} onChange={handleChange} required>
      <option value="">Seleccione un puesto</option>
      {puestosFiltrados.map(p => (
        <option key={p.id_puesto} value={p.id_puesto}>
          {p.nombre_puesto}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label>Estado</label>
    <select name="id_estado" value={form.id_estado} onChange={handleChange} required>
      <option value="">Seleccione un estado</option>
      {estados.map(est => (
        <option key={est.id_estado} value={est.id_estado}>
          {est.estado}
        </option>
      ))}
    </select>
  </div>

  <button type="submit">Actualizar</button>
</form>

      </div>
    );
  };
  
  export const NuevoEmpleado = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
      nombres: '', apellidos: '', dpi: '', email: '', telefono: '',
      fecha_contratacion: '', salario_base: '',
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
        <button className="btn volver" onClick={() => navigate('/empleados')}>🔙 Volver</button>
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
  