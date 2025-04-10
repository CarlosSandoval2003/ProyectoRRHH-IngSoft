// /middlewares/authMiddleware.js
const jwt = require('jsonwebtoken'); // Necesitas instalar jsonwebtoken

const verificarAutenticacion = (req, res, next) => {
  const token = req.headers['authorization']; // Token enviado en el encabezado 'Authorization'

  if (!token) {
    return res.status(401).json({ msg: 'Token no proporcionado' });
  }

  // Verificar el token
  jwt.verify(token, 'tu_clave_secreta', (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: 'Token inválido' });
    }
    req.usuario = decoded; // Guardar los datos del usuario decodificado en req.usuario
    next(); // Continuar con la ejecución del siguiente middleware o la ruta
  });
};

module.exports = { verificarAutenticacion };
