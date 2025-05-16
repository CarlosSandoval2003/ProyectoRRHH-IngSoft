// backend/controllers/mantenimientousuarioController.js
const bcrypt = require('bcrypt');
const Model  = require('../models/mantenimientousuarioModel');

exports.listar = async (req, res) => {
  try {
    const usuarios = await Model.list();
    res.json(usuarios);
  } catch (err) {
    console.error('Error listar usuarios:', err);
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
};

exports.obtener = async (req, res) => {
  try {
    const [usuario] = await Model.getById(Number(req.params.id));
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    console.error('Error obtener usuario:', err);
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
};

exports.insertar = async (req, res) => {
  try {
    // Hasheamos la contraseña recibida
    const hash = await bcrypt.hash(req.body.password, 10);

    // Llamamos al SP con el hash en lugar del plain
    const [out] = await Model.create({
      username: req.body.username,
      password: hash,
      id_rol:   req.body.id_rol
    });
    res.status(201).json(out);
  } catch (err) {
    console.error('Error insertar usuario:', err);
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    // Construimos el payload mínimo
    const payload = {
      id_usuario: Number(req.params.id),
      username:   req.body.username,
      id_rol:     req.body.id_rol,
      password:   ''  // placeholder para el SP
    };

    // Si envían nueva contraseña, la hash-eamos
    if (req.body.password) {
      payload.password = await bcrypt.hash(req.body.password, 10);
    }

    const [out] = await Model.update(payload);
    res.json(out);
  } catch (err) {
    console.error('Error actualizar usuario:', err);
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const [out] = await Model.delete(Number(req.params.id));
    res.json(out);
  } catch (err) {
    console.error('Error eliminar usuario:', err);
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
};
