const express = require('express');
const router = express.Router();
const nominaController = require('../controllers/nominaController');

router.get('/empleados', nominaController.getEmpleados);
router.get('/tipos-nomina', nominaController.getTiposNomina);
router.post('/generar', nominaController.generarNominaEmpleado);
router.get('/departamentos', nominaController.getDepartamentos);
router.get('/empleados/:id_departamento', nominaController.getEmpleadosPorDepartamento);
router.get('/empleados/todos', nominaController.getTodosLosEmpleados);
router.get('/buscar/:termino', nominaController.buscarEmpleados);
router.get('/listado-nominas', nominaController.getListadoNominas);
router.post('/generar-masivo', nominaController.generarNominaMasiva);
router.post('/generar-departamento', nominaController.generarNominaPorDepartamento);
router.get('/detalle-grupo/:fecha_nomina/:id_tipo_nomina', nominaController.getDetalleNominaPorGrupo);
router.get('/detalle-empleado/:id_nomina', nominaController.getDetalleNominaEmpleado);








module.exports = router;
