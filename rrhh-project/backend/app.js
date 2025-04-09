const express = require('express');
const cors = require('cors');
const app = express();
const empleadoRoutes = require('./routes/empleadoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const nominaRoutes = require('./routes/nominaRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/empleados', empleadoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/nominas', nominaRoutes);

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
