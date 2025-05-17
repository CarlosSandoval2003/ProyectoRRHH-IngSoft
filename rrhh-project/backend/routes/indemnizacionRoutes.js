const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/indemnizacionController');

router.post('/generar/:id_empleado', ctrl.generarLiquidacion);
router.get('/historial', ctrl.obtenerLiquidaciones);
router.get('/detalle/:id', ctrl.obtenerDetalleLiquidacion);


module.exports = router;
