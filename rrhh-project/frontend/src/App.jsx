import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Nomina from './pages/Nomina';
import ListadoNominas from './pages/ListadoNominas';
import DetalleNominas from './pages/DetalleNominas';
// import otros componentes cuando los tengas

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nomina" element={<Nomina />} />
        <Route path="/listado-nominas" element={<ListadoNominas />} />
        <Route path="/detalle-nomina/:fecha_nomina/:id_tipo_nomina" element={<DetalleNominas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
