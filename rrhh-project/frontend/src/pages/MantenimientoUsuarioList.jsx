// src/pages/MantenimientoUsuarioList.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import './MantenimientoUsuario.css';

const MantenimientoUsuarioList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/usuariosm')
      .then(({ data }) => setUsuarios(data))
      .catch(err => console.error('Error al listar usuarios:', err));
  }, []);

  const handleDelete = id => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    api.delete(`/usuariosm/${id}`)
      .then(() => setUsuarios(prev => prev.filter(u => u.id_usuario !== id)))
      .catch(err => console.error('Error al eliminar usuario:', err));
  };

  return (
    <div className="page-usuarios">
      <button className="btn-volver" onClick={() => navigate('/dashboard')}>⬅️ Volver</button>
      <h2></h2>
      <button className="btn-volver" onClick={() => navigate('/dashboard')}>🏠 Inicio</button>
      <h2>Lista de Usuarios</h2>
      <Link to="/usuarios/nuevo" className="btn">Crear usuario</Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? usuarios.map(u => (
            <tr key={u.id_usuario}>
              <td>{u.id_usuario}</td>
              <td>{u.username}</td>
              <td>{u.rol}</td>
              <td>
                <Link to={`/usuarios/${u.id_usuario}`} className="btn btn-sm btn-edit">Editar</Link>
                <button
                  onClick={() => handleDelete(u.id_usuario)}
                  className="btn btn-sm btn-delete"
                >Eliminar</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4">No hay usuarios para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MantenimientoUsuarioList;
