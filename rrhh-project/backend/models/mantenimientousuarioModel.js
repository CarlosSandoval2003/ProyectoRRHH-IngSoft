const db = require('../config/db');

const MantenimientoUsuarioModel = {};

MantenimientoUsuarioModel.listarUsuarios = (callback) => {
  db.query('CALL sp_gestion_usuario("LISTAR", NULL, NULL, NULL, NULL)', (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

MantenimientoUsuarioModel.obtenerUsuario = (id, callback) => {
  db.query('CALL sp_gestion_usuario("OBTENER", ?, NULL, NULL, NULL)', [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0][0]);
  });
};

MantenimientoUsuarioModel.insertarUsuario = (username, password, id_rol, callback) => {
  db.query('CALL sp_gestion_usuario("INSERTAR", NULL, ?, ?, ?)', [username, password, id_rol], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0][0]);
  });
};

MantenimientoUsuarioModel.actualizarUsuario = (id, username, password, id_rol, callback) => {
  db.query('CALL sp_gestion_usuario("ACTUALIZAR", ?, ?, ?, ?)', [id, username, password, id_rol], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0][0]);
  });
};

MantenimientoUsuarioModel.eliminarUsuario = (id, callback) => {
  db.query('CALL sp_gestion_usuario("ELIMINAR", ?, NULL, NULL, NULL)', [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0][0]);
  });
};

MantenimientoUsuarioModel.listarRoles = (callback) => {
  db.query('CALL sp_listar_roles()', (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

module.exports = MantenimientoUsuarioModel;
