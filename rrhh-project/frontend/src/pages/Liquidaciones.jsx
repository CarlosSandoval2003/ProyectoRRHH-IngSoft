import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Liquidaciones.css';


export default function Liquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  const [detalleVisible, setDetalleVisible] = useState(null);
const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/indemnizacion/historial')
      .then(res => setLiquidaciones(res.data))
      .catch(err => console.error('❌ Error al cargar:', err));
  }, []);

  const filtradas = liquidaciones.filter(liq =>
    liq.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const verDetalle = async (id_liquidacion) => {
  if (detalleVisible === id_liquidacion) {
    setDetalleVisible(null);
    return;
  }

  try {
    const res = await axios.get(`http://localhost:3001/api/indemnizacion/detalle/${id_liquidacion}`);
    setDetalle(res.data);
    setDetalleVisible(id_liquidacion);
  } catch (err) {
    console.error("❌ Error al obtener detalle:", err);
  }
};

  return (
    <div className="contenedor-nomina">
      <button onClick={() => navigate('/dashboard')} className="btn-volver">🏠 Inicio</button>
      <button onClick={() => navigate('/dashboard')} className="btn-volver">🔙 Volver</button>
      <h2>Lista de Liquidaciones</h2>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        className="input-busqueda"
      />

      <table className="tabla-nomina">
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Fecha Despido</th>
            <th>Indemnización</th>
            <th>Vacaciones</th>
            <th>Aguinaldo</th>
            <th>Bono 14</th>
            <th>Horas Extra</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map((liq, i) => (
            <tr key={i}>
              <td>{liq.nombre_completo}</td>
              <td>{liq.fecha_despido}</td>
              <td>Q {liq.indemnizacion}</td>
              <td>Q {liq.vacaciones_pendientes}</td>
              <td>Q {liq.aguinaldo_proporcional}</td>
              <td>Q {liq.bono14_proporcional}</td>
              <td>Q {liq.horas_extra_mes}</td>
              <td style={{ fontWeight: 'bold' }}>Q {liq.total_liquidacion}</td>
              <td>
                <button className="btn" onClick={() => verDetalle(liq.id_liquidacion)}>
  {detalleVisible === liq.id_liquidacion ? "Ocultar" : "Ver Detalle"}
</button>

              </td>
              {detalleVisible === liq.id_liquidacion && detalle && (
  <tr>
    <td colSpan="9">
      <div className="detalle-liquidacion">
        <strong>Salario Promedio:</strong> Q {detalle.salario_promedio} <br />
        <strong>Años Completos:</strong> {detalle.anios_completos} <br />
        <strong>Meses:</strong> {detalle.meses} <br />
        <strong>Días No Gozados:</strong> {detalle.dias_no_gozados} <br />
        <strong>Fecha de Registro:</strong> {new Date(detalle.fecha_registro).toLocaleString()}
      </div>
    </td>
  </tr>
)}

            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
  );
}
