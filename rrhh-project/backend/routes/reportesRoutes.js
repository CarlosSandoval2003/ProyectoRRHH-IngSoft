const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportesController');

router.get('/horas-extra/:mes/:anio', ctrl.getHorasExtraPorMes);
router.get('/gasto-departamento/:mes/:anio', ctrl.getGastoNominaPorDepartamento);

router.post('/generar-planilla', ctrl.generarPlanilla);
router.get('/detalle-planilla/:id_nomina', ctrl.getDetallePlanilla);


module.exports = router;
