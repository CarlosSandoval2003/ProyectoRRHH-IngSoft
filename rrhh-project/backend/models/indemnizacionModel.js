const db = require('../config/db');

module.exports = {
  calcularLiquidacion: (id_empleado, fecha_despido) => {
    return new Promise((resolve, reject) => {
      db.query('CALL sp_calcular_liquidacion_despido(?, ?)', [id_empleado, fecha_despido], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // la liquidación calculada
      });
    });
  },

listarLiquidaciones: () => {
  return new Promise((resolve, reject) => {
    db.query('CALL sp_listar_liquidaciones()', (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // Primera tabla devuelta
    });
  });
},
obtenerLiquidacionPorId: (id_liquidacion) => {
  return new Promise((resolve, reject) => {
    db.query('CALL sp_obtener_liquidacion_por_id(?)', [id_liquidacion], (err, results) => {
      if (err) return reject(err);
      resolve(results[0][0]); // solo un resultado
    });
  });
}


};


