const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const nominaRoutes = require('./routes/nominaRoutes'); // ✅ agregar esto
const empleadoRoutes = require('./routes/empleadoRoutes');
const indemnizacionRoutes = require('./routes/indemnizacionRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const userRts = require('./routes/mantenimientousuarioRoutes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/usuariosm', userRts);
app.use('/api/nomina', nominaRoutes); // ✅ montar las rutas
app.use('/api/empleados', empleadoRoutes);
app.use('/api/indemnizacion', indemnizacionRoutes);
app.use('/api/reportes', reportesRoutes);

// Puerto
app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
