import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
// import otros componentes cuando los tengas

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Aquí irán Empleados, Nómina, etc */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
