const bcrypt = require('bcrypt');
const MantenimientoUsuarioModel = require('../models/mantenimientousuarioModel');

exports.listar = (req, res) => {
  MantenimientoUsuarioModel.listarUsuarios((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.obtener = (req, res) => {
  MantenimientoUsuarioModel.obtenerUsuario(Number(req.params.id), (err, usuario) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  });
};

exports.insertar = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    MantenimientoUsuarioModel.insertarUsuario(req.body.username, hash, req.body.id_rol, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(result);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    let password = '';
    if (req.body.password) {
      password = await bcrypt.hash(req.body.password, 10);
    }
    MantenimientoUsuarioModel.actualizarUsuario(Number(req.params.id), req.body.username, password, req.body.id_rol, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminar = (req, res) => {
  MantenimientoUsuarioModel.eliminarUsuario(Number(req.params.id), (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

exports.listarRoles = (req, res) => {
  MantenimientoUsuarioModel.listarRoles((err, roles) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(roles);
  });
};
