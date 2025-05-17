const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mantenimientousuarioController');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', ctrl.insertar);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);
router.get('/roles/listar', ctrl.listarRoles); // <- ruta para dropdown de roles

module.exports = router;
