const Usuario = require('../models/usuarioModel');

exports.login = (req, res) => {
  const { username, password } = req.body;
  Usuario.login(username, password, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(401).json({ msg: 'Credenciales inválidas' });
    res.json(result[0]);
  });
};
