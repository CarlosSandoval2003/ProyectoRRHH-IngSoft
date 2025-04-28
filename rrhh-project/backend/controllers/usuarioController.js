
const Usuario = require('../models/usuarioModel'); 
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { username, password } = req.body;

  Usuario.login(username, password, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(401).json({ msg: 'Credenciales inválidas' });

    const user = result[0];
    
    // Aquí creamos el token para el usuario con su rol
    const token = jwt.sign(
      { username: user.username, rol: user.rol }, 
      'tu_clave_secreta', // Esta es la clave secreta para firmar el JWT
      { expiresIn: '1h' } // Expiración del token (opcional)
    );
    
    res.json({
      msg: `Bienvenido ${user.username}, eres un ${user.rol}`,
      token: token, // Enviamos el token al frontend
      usuario: user.username,
      rol: user.rol
    });
  });
};
