const express = require('express');
const router  = express.Router();
const empCtrl = require('../controllers/empleadoController');

// SP-powered selects
router.get('/puestos',       empCtrl.listarPuestos);
router.get('/departamentos', empCtrl.listarDepartamentos);
router.get('/estados',       empCtrl.listarEstados);
router.get('/puestos/:id', empCtrl.listarPuestosPorDepartamento);



// 💡 ESTA DEBE IR ANTES DE /:id
router.get('/horasextras/:id', empCtrl.obtenerHorasExtrasMesActual);
router.get('/horasextras/listar/:id', empCtrl.listarHorasExtraMesActual);
router.post('/horasextras/insertar/:id', empCtrl.insertarHoraExtra);




// CRUD Empleados via sp_gestion_empleado
router.get('/',       empCtrl.listarEmpleados);
router.get('/:id',    empCtrl.obtenerEmpleado);
router.post('/',      empCtrl.crearEmpleado);
router.put('/:id',    empCtrl.actualizarEmpleado);
router.delete('/:id', empCtrl.eliminarEmpleado);

// Vacaciones
router.get('/calendario/:id', empCtrl.listarDiasCalendarioMesActual);
router.post('/calendario/:id', empCtrl.guardarDiasCalendarioMesActual);
router.get('/ciclo-vacaciones/:id', empCtrl.obtenerCicloVacaciones);


router.get('/bono-incentivo/:id', empCtrl.obtenerBonoIncentivo);
router.post('/bono-incentivo/:id', empCtrl.guardarBonoIncentivo);
module.exports = router;
