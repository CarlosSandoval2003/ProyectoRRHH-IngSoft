import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Reportes.css';
import { Bar, Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Reportes() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [topHoras, setTopHoras] = useState([]);
  const [gastoDepartamentos, setGastoDepartamentos] = useState([]);
  const navigate = useNavigate();


  const [tiposNomina, setTiposNomina] = useState([]);
const [departamentos, setDepartamentos] = useState([]);
const [formularioVisible, setFormularioVisible] = useState(false);
const [incluirDesglose, setIncluirDesglose] = useState(false);
const [formato, setFormato] = useState('vista');
const [encabezado, setEncabezado] = useState('');
const [tipoNomina, setTipoNomina] = useState('');
const [dep, setDep] = useState('');


useEffect(() => {
  axios.get('http://localhost:3001/api/nomina/tipos-nomina').then(res => setTiposNomina(res.data));
  axios.get('http://localhost:3001/api/nomina/departamentos').then(res => setDepartamentos(res.data));
}, []);

  useEffect(() => {
    cargarDatos();
  }, [mes, anio]);

  const cargarDatos = async () => {
    try {
      const [resHoras, resGasto] = await Promise.all([
        axios.get(`http://localhost:3001/api/reportes/horas-extra/${mes}/${anio}`),
        axios.get(`http://localhost:3001/api/reportes/gasto-departamento/${mes}/${anio}`)
      ]);
      setTopHoras(resHoras.data);
      setGastoDepartamentos(resGasto.data);
    } catch (err) {
      console.error('❌ Error al cargar reportes:', err);
    }
  };

  const dataBarras = {
    labels: topHoras.map(e => e.nombre_empleado),
    datasets: [
      {
        label: 'Horas Extra',
        data: topHoras.map(e => e.total_horas),
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      }
    ]
  };

  const dataPie = {
    labels: gastoDepartamentos.map(d => d.nombre_departamento),
    datasets: [
      {
        label: 'Gasto Total (Q)',
        data: gastoDepartamentos.map(d => d.total_gasto),
        backgroundColor: [
          '#ff6384',
          '#36a2eb',
          '#ffce56',
          '#4bc0c0',
          '#9966ff',
          '#ff9f40'
        ]
      }
    ]
  };

  return (
    <div className="contenedor-reportes">
      <h2>📊 Reportes</h2>

      <button className="btn-volver" onClick={() => navigate('/dashboard')}>⬅️ Volver</button>
      <h2></h2>
      <button className="btn-volver" onClick={() => navigate('/dashboard')}>🏠 Inicio</button>

      <div className="filtros">
        <label>Mes:</label>
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <label>Año:</label>
        <select value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
          {[2023, 2024, 2025].map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="graficas">
        <div className="grafica">
          <h3>📶 Top Empleados con más Horas Extra</h3>
          <Bar data={dataBarras} />
        </div>

        <div className="grafica">
          <h3>💸 Departamentos con mayor Gasto</h3>
          <Pie data={dataPie} />
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button className="btn btn-generar" onClick={() => setFormularioVisible(!formularioVisible)}>
    📄 {formularioVisible ? 'Ocultar' : 'Generar Planilla'}
  </button>
      </div>
      {formularioVisible && (
  <div className="form-planilla">
    <h3>🧾 Generar Planilla</h3>

    <div className="campos">
      <label>Mes:</label>
      <select value={mes} onChange={e => setMes(Number(e.target.value))}>
        {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
      </select>

      <label>Año:</label>
      <select value={anio} onChange={e => setAnio(Number(e.target.value))}>
        {[2023, 2024, 2025].map(a => <option key={a} value={a}>{a}</option>)}
      </select>

<select value={tipoNomina} onChange={e => setTipoNomina(e.target.value)}>
  <option value="">-- Selecciona --</option>
  {tiposNomina.map(t => (
    <option key={t.id_tipo_nomina} value={t.id_tipo_nomina}>{t.tipo}</option>
  ))}
</select>

<select value={dep} onChange={e => setDep(e.target.value)}>
  <option value="">Todos</option>
  {departamentos.map(d => (
    <option key={d.id_departamento} value={d.id_departamento}>{d.nombre_departamento}</option>
  ))}
</select>


      <label>Formato:</label>
      <select value={formato} onChange={e => setFormato(e.target.value)}>
        <option value="excel">Excel</option>
        <option value="pdf">PDF</option>
      </select>

      <label>Encabezado personalizado:</label>
      <textarea
        value={encabezado}
        onChange={e => setEncabezado(e.target.value)}
        placeholder="Ej: Planilla oficial aprobada por RRHH"
      ></textarea>

      <button
        className="btn"
        onClick={async () => {
  try {
    const payload = {
      mes,
      anio,
      id_tipo_nomina: tipoNomina,
      id_departamento: dep === "" ? null : Number(dep),
      formato,
      incluirDesglose,
      encabezado
    };

    if (formato === 'vista') {
      const res = await axios.post('http://localhost:3001/api/reportes/generar-planilla', payload);
      console.table(res.data);
      alert(`✅ Planilla generada con ${res.data.length} empleados.`);
    } else {
      const response = await axios.post(
        'http://localhost:3001/api/reportes/generar-planilla',
        payload,
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], {
        type: formato === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `planilla.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (err) {
    console.error('❌ Error al generar planilla:', err);
    alert('Error al generar planilla');
  }
}}

      >
        Generar Planilla
      </button>
    </div>
  </div>
)}
    </div>
  );
}