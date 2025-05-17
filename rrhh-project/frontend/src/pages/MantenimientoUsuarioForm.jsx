// src/pages/MantenimientoUsuarioForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import './MantenimientoUsuario.css';

const MantenimientoUsuarioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    id_rol: ''
  });
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
  api.get('/usuariosm/roles/listar')
    .then(({ data }) => setRoles(data))
    .catch(err => console.error('Error al cargar roles:', err));
}, []);


  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/usuariosm/${id}`)
        .then(({ data }) => {
          setForm({
            username: data.username,
            password: '',       // dejamos vacío
            id_rol:   data.id_rol
          });
        })
        .catch(err => console.error('Error al obtener usuario:', err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/usuariosm/${id}`, form);
        alert('Usuario actualizado.');
      } else {
        await api.post('/usuariosm', form);
        alert('Usuario creado.');
      }
      navigate('/usuarios');
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      alert('Ocurrió un error. Revisa la consola.');
    }
  };

  if (loading) return <p className="page-usuarios">Cargando usuario…</p>;

  return (
    <div className="page-usuarios">
      <h2>{id ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={id ? 'Déjalo vacío para no cambiar' : ''}
            {...(!id && { required: true })}
          />
        </div>
        <div>
  <label>Rol:</label>
  <select
    name="id_rol"
    value={form.id_rol}
    onChange={handleChange}
    required
  >
    <option value="">-- Selecciona un rol --</option>
    {roles.map(rol => (
      <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre_rol}</option>
    ))}
  </select>
</div>


        <button type="submit" className="btn">
          {id ? 'Actualizar Usuario' : 'Crear Usuario'}
        </button>
        <button
          type="button"
          className="btn btn-delete"
          onClick={() => navigate('/usuarios')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default MantenimientoUsuarioForm;
