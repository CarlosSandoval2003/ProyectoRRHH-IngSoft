// /app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuarioRoutes');  // Importamos las rutas de usuario

// Configuración de middlewares
app.use(cors());  // Para habilitar CORS si lo necesitas
app.use(bodyParser.json());  // Para que Express pueda manejar JSON

// Usar las rutas de usuario
app.use('/api/usuarios', usuarioRoutes);

// Iniciar el servidor
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
