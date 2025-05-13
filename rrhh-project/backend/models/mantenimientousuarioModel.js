// backend/models/mantenimientousuarioModel.js
const db = require('../config/db');

class MantenimientoUsuarioModel {
  static callSP(accion, id_usuario = null, username = null, password = null, id_rol = null) {
    return new Promise((resolve, reject) => {
      db.query(
        'CALL sp_gestion_usuario(?,?,?,?,?)',
        [accion, id_usuario, username, password, id_rol],
        (err, resultSets) => {
          if (err) return reject(err);

          // mysql2 en modo callback suele devolver:
          // resultSets = [ rowsArray, ... ]
          // donde rowsArray = [ {…}, {…}, … ]
          const filas = Array.isArray(resultSets[0])
            ? resultSets[0]
            : resultSets;

          resolve(filas);
        }
      );
    });
  }

  static list()    { return this.callSP('LISTAR'); }
  static getById(id)   { return this.callSP('OBTENER', id); }
  static create(d)     { return this.callSP('INSERTAR', null, d.username, d.password, d.id_rol); }
  static update(d)     { return this.callSP('ACTUALIZAR', d.id_usuario, d.username, d.password, d.id_rol); }
  static delete(id)    { return this.callSP('ELIMINAR', id); }
}

module.exports = MantenimientoUsuarioModel;
