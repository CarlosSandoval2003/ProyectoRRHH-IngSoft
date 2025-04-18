// /routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const { verificarAutenticacion } = require('../middlewares/authMiddleware'); // Importamos el middleware

// Ruta de login
router.post('/login', UsuarioController.login);

// Ruta de perfil (requiere autenticación)
router.get('/perfil', verificarAutenticacion, (req, res) => {
  // Si el usuario está autenticado, respondemos con su nombre de usuario y rol
  res.json({ msg: `Bienvenido ${req.usuario.username}, tu rol es: ${req.usuario.rol}` });
});

// Ruta de admin (solo accesible por usuarios con rol 'admin')
router.get('/admin', verificarAutenticacion, (req, res) => {
  // Solo los usuarios con rol 'admin' pueden acceder a esta ruta
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado, necesitas ser administrador' });
  }
  res.json({ msg: 'Acceso concedido a Admin' });
});

module.exports = router;
