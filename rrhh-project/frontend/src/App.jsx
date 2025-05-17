import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Nomina from './pages/Nomina';
import ListadoNominas from './pages/ListadoNominas';
import DetalleNominas from './pages/DetalleNominas';
import NominasEmpleado from './pages/NominasEmpleado';
import { DetalleEmpleado, EditarEmpleado, NuevoEmpleado } from './pages/EmpleadoForms';
import Empleados from './pages/Empleados';
import Liquidaciones from './pages/Liquidaciones';
import MantenimientoUsuarioList from './pages/MantenimientoUsuarioList';
import MantenimientoUsuarioForm from './pages/MantenimientoUsuarioForm';
import Reportes from './pages/Reportes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nomina" element={<Nomina />} />
        <Route path="/listado-nominas" element={<ListadoNominas />} />
        <Route path="/detalle-nomina/:fecha_nomina/:id_tipo_nomina" element={<DetalleNominas />} />
        <Route path="/nominas-empleado/:id_empleado" element={<NominasEmpleado />} />


        <Route path="/empleados" element={<Empleados />} />
        <Route path="/empleados/nuevo" element={<NuevoEmpleado />} />
        <Route path="/empleados/editar/:id" element={<EditarEmpleado />} />
        <Route path="/empleados/:id" element={<DetalleEmpleado />} />
        
        <Route path="/liquidaciones" element={<Liquidaciones />} />

        <Route path="/usuarios"        element={<MantenimientoUsuarioList />} />
        <Route path="/usuarios/nuevo"  element={<MantenimientoUsuarioForm />} />
        <Route path="/usuarios/:id"    element={<MantenimientoUsuarioForm />} />

        <Route path="/reportes" element={<Reportes />} />
        
      </Routes>


    </BrowserRouter>
  );
}

export default App;
