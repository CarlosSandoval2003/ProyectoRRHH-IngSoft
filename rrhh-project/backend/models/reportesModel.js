const db = require('../config/db');

const ReportesModel = {};

ReportesModel.obtenerHorasExtraPorMes = (mes, anio, callback) => {
  db.query("CALL sp_empleados_mas_horas_extra(?, ?)", [mes, anio], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

ReportesModel.obtenerGastoNominaPorDepartamento = (mes, anio, callback) => {
  db.query("CALL sp_gasto_nomina_por_departamento(?, ?)", [mes, anio], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};


ReportesModel.generarPlanilla = (mes, anio, tipoNomina, departamento, callback) => {
  const query = "CALL sp_generar_planilla(?, ?, ?, ?)";
  db.query(query, [mes, anio, tipoNomina, departamento], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

ReportesModel.detallePlanillaPorNomina = (id_nomina, callback) => {
  db.query("CALL sp_detalle_planilla_por_nomina(?)", [id_nomina], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};



module.exports = ReportesModel;
