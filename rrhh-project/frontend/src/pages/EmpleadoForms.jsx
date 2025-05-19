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
const [laborados, setLaborados] = useState([]);
const [vacaciones, setVacaciones] = useState([]);
const [idCicloVacaciones, setIdCicloVacaciones] = useState(null);
const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1); // 1 a 12
const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
const [mostrarBono, setMostrarBono] = useState(false);
const [bonoActivo, setBonoActivo] = useState(false);
const [bonoMonto, setBonoMonto] = useState(0);



const cargarBonoIncentivo = async () => {
  try {
    const res = await axios.get(`http://localhost:3001/api/empleados/bono-incentivo/${id}`);
    setBonoActivo(res.data.esta_activo === 1);
    setBonoMonto(res.data.monto);
  } catch (err) {
    console.error("❌ Error al cargar bono:", err);
  }
};

const guardarBonoIncentivo = async () => {
  try {
    await axios.post(`http://localhost:3001/api/empleados/bono-incentivo/${id}`, {
      monto: bonoMonto,
      activo: bonoActivo
    });
    alert("✅ Bono guardado correctamente.");
    setMostrarBono(false);
  } catch (err) {
    console.error("❌ Error al guardar bono:", err);
    alert("❌ Error al guardar bono.");
  }
};

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

const toggleDia = (fecha, tipo) => {
  if (tipo === 'Laborado') {
    if (vacaciones.includes(fecha)) return; // si está como vacación no puede ser trabajado

    setLaborados(prev =>
      prev.includes(fecha) ? prev.filter(f => f !== fecha) : [...prev, fecha]
    );
  } else if (tipo === 'Vacación') {
    if (laborados.includes(fecha)) return; // si está como trabajado no puede ser vacación

    setVacaciones(prev =>
      prev.includes(fecha) ? prev.filter(f => f !== fecha) : [...prev, fecha]
    );
  }
};

const guardarCalendario = async () => {
  try {
    // 1. Obtener el ciclo activo desde el backend
    const cicloRes = await axios.get(`http://localhost:3001/api/empleados/ciclo-vacaciones/${id}`);
    const id_ciclo = cicloRes.data.id_ciclo;

    // 2. Enviar los datos al backend
    await axios.post(`http://localhost:3001/api/empleados/calendario/${id}`, {
      laborados,
      vacaciones,
      id_ciclo
    });

    alert("✅ Calendario actualizado correctamente.");
    setMostrarDias(false);
  } catch (err) {
    console.error("❌ Error al guardar calendario:", err);
    alert("❌ Error al guardar días.");
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
    axios.get(`http://localhost:3001/api/empleados/bono-incentivo/${id}`)
  .then(res => {
    setBonoActivo(res.data.esta_activo === 1);
    setBonoMonto(res.data.monto);
  })
  .catch(err => console.error("❌ Error al obtener bono:", err));

    
    
      }, [id]);

   useEffect(() => {
  if (!mostrarDias) return;

  const cargarDias = async () => {
    try {
      const [diasRes, cicloRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/empleados/calendario/${id}?mes=${mesSeleccionado}&anio=${anioSeleccionado}`),
        axios.get(`http://localhost:3001/api/empleados/ciclo-vacaciones/${id}`)
      ]);

      const laborados = diasRes.data.filter(d => d.tipo === 'Laborado').map(d => d.fecha);
      const vacaciones = diasRes.data.filter(d => d.tipo === 'Vacación').map(d => d.fecha);
      setLaborados(laborados);
      setVacaciones(vacaciones);
      setIdCicloVacaciones(cicloRes.data.id_ciclo || null);

      const diasMes = new Date(anioSeleccionado, mesSeleccionado, 0).getDate();
      const fechas = [];
      for (let dia = 1; dia <= diasMes; dia++) {
        const fecha = new Date(anioSeleccionado, mesSeleccionado - 1, dia).toISOString().split('T')[0];
        fechas.push(fecha);
      }

      setTodosLosDias(fechas);
    } catch (err) {
      console.error("❌ Error al cargar días o ciclo:", err);
    }
  };

  cargarDias();
}, [mesSeleccionado, anioSeleccionado, mostrarDias]);



    
    
  
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
    <h3>Calendario del Empleado</h3>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
  <label>
    Mes:&nbsp;
    <select value={mesSeleccionado} onChange={e => setMesSeleccionado(parseInt(e.target.value))}>
      {[
        [1, 'Enero'], [2, 'Febrero'], [3, 'Marzo'], [4, 'Abril'],
        [5, 'Mayo'], [6, 'Junio'], [7, 'Julio'], [8, 'Agosto'],
        [9, 'Septiembre'], [10, 'Octubre'], [11, 'Noviembre'], [12, 'Diciembre']
      ].map(([val, name]) => (
        <option key={val} value={val}>{name}</option>
      ))}
    </select>
  </label>

  <label>
    Año:&nbsp;
    <input
      type="number"
      value={anioSeleccionado}
      onChange={e => setAnioSeleccionado(parseInt(e.target.value))}
      style={{ width: '80px' }}
    />
  </label>
</div>

      <div style={{ textAlign: 'center', margin: '10px' }}>
  <button onClick={() => {
    const nuevasLaborados = todosLosDias.filter(f => !vacaciones.includes(f));
    setLaborados(nuevasLaborados);
  }}>
    ✅ Marcar Todo como Trabajado
  </button>
</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
      {todosLosDias.map(fecha => (
        <div key={fecha} style={{ minWidth: '120px', textAlign: 'center', background: '#222', padding: '5px', borderRadius: '6px' }}>
          <label>
            <input
              type="checkbox"
              checked={laborados.includes(fecha)}
              onChange={() => toggleDia(fecha, 'Laborado')}
              disabled={vacaciones.includes(fecha)}
            /> Trabajo
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={vacaciones.includes(fecha)}
              onChange={() => toggleDia(fecha, 'Vacación')}
              disabled={laborados.includes(fecha)}
            /> Vacación
          </label>
          <div style={{ fontSize: '12px', color: '#bbb' }}>{fecha}</div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: '10px' }}>
      <button onClick={guardarCalendario}>💾 Guardar Cambios</button>
      <button className="btn-volver" onClick={() => setMostrarDias(false)} style={{ marginLeft: '10px' }}>
        ❌ Cancelar
      </button>
    </div>
  </div>
)}
{mostrarBono && (
  <div className="panel-horas-extra">
    <h3>Bono Incentivo del Empleado</h3>
    <div style={{ marginBottom: '10px', textAlign: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={bonoActivo}
          onChange={(e) => setBonoActivo(e.target.checked)}
        /> Activo
      </label>
    </div>

    <div style={{ marginBottom: '10px', textAlign: 'center' }}>
      <input
        type="number"
        step="0.01"
        value={bonoMonto}
        onChange={(e) => setBonoMonto(parseFloat(e.target.value))}
        disabled={!bonoActivo}
        placeholder="Monto del Bono"
        style={{ width: '150px', padding: '5px' }}
      />
    </div>

    <div style={{ textAlign: 'center' }}>
      <button onClick={guardarBonoIncentivo}>💾 Guardar Bono</button>
      <button className="btn-volver" onClick={() => setMostrarBono(false)} style={{ marginLeft: '10px' }}>
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
<div style={{ marginBottom: '10px', textAlign: 'center' }}>
  <button className="btn-volver" onClick={() => {
    setMostrarBono(!mostrarBono);
    if (!mostrarBono) cargarBonoIncentivo();
  }}>
    💰 Bono Incentivo
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
    const [departamentos, setDepartamentos] = useState([]);
const [puestosFiltrados, setPuestosFiltrados] = useState([]);
const [estados, setEstados] = useState([]);

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
  if (!form.id_departamento) return;

  const cargarPuestos = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/empleados/puestos/${form.id_departamento}`);
      setPuestosFiltrados(res.data);
    } catch (err) {
      console.error("❌ Error al cargar puestos:", err);
    }
  };

  cargarPuestos();
}, [form.id_departamento]);


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
    {!validaciones.dpi && <p className="error">❌ El DPI ya está registrado</p>}
  </div>

  <div>
    <label>Email</label>
    <input name="email" value={form.email} onChange={handleChange} required />
    {!validaciones.email && <p className="error">❌ El email ya está registrado</p>}
  </div>

  <div>
    <label>Teléfono</label>
    <input name="telefono" value={form.telefono} onChange={handleChange} required />
    {!validaciones.telefono && <p className="error">❌ El teléfono ya está registrado</p>}
  </div>

  <div>
    <label>Fecha de Contratación</label>
    <input type="date" name="fecha_contratacion" value={form.fecha_contratacion} onChange={handleChange} required />
  </div>

  <div>
    <label>Salario Base</label>
    <input type="number" name="salario_base" value={form.salario_base} onChange={handleChange} required />
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
  