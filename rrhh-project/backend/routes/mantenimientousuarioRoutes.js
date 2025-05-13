// backend/routes/mantenimientousuarioRoutes.js
const router = require('express').Router();
const ctrl   = require('../controllers/mantenimientousuarioController');

router.get('/',    ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/',   ctrl.insertar);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
