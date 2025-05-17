const db = require('../config/db');

const NominaModel = {};

NominaModel.obtenerEmpleadosActivos = (callback) => {
  const query = "CALL sp_obtener_empleados_activos()";
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]); // ⚠️ los resultados de CALL vienen en [0]
  });
};

NominaModel.obtenerTodosLosEmpleados = (callback) => {
  const query = "CALL sp_obtener_empleados_activos()";
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

NominaModel.buscarEmpleados = (termino, callback) => {
  const query = "CALL sp_buscar_empleados(?)";
  db.query(query, [termino], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};


NominaModel.obtenerTiposNomina = (callback) => {
  const query = "CALL sp_obtener_tipos_nomina()";
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

NominaModel.generarNominaEmpleado = (params, callback) => {
  const query = "CALL sp_generar_nomina_empleado(?, ?, ?, ?, ?, ?, ?)";
  db.query(query, params, callback);
};


NominaModel.obtenerListadoNominas = (callback) => {
  const query = "CALL sp_listado_nominas_generadas()";
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

NominaModel.obtenerDepartamentoEmpleado = (id_empleado, callback) => {
  const query = "CALL sp_obtener_departamento_empleado(?)";
  db.query(query, [id_empleado], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};


NominaModel.generarNominaTodos = (params, callback) => {
  const query = "CALL sp_generar_nomina_todos(?, ?, ?, ?, ?)";
  db.query(query, params, callback);
};

NominaModel.generarNominaPorDepartamento = (params, callback) => {
  const query = "CALL sp_generar_nomina_por_departamento(?, ?, ?, ?, ?, ?)";
  db.query(query, params, callback);
};

NominaModel.obtenerDetalleNominaPorGrupo = (fecha_nomina, id_tipo_nomina, callback) => {
  const query = "CALL sp_detalle_nomina_por_grupo(?, ?)";
  db.query(query, [fecha_nomina, id_tipo_nomina], (err, results) => {
    if (err) return callback(err);
    const encabezado = results[0][0] || null;
    const empleados = results[1] || [];
    callback(null, { encabezado, empleados });
  });
};

NominaModel.obtenerDetalleNominaEmpleado = (id_nomina, callback) => {
  const query = "CALL sp_detalle_nomina_empleado_por_id(?)";
  db.query(query, [id_nomina], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};




NominaModel.obtenerDepartamentos = (callback) => {
  const query = "CALL sp_obtener_departamentos()";
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

NominaModel.obtenerEmpleadosPorDepartamento = (id_departamento, callback) => {
  const query = "CALL sp_empleados_por_departamento(?)";
  db.query(query, [id_departamento], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

NominaModel.buscarNominasPorEmpleado = (termino, callback) => {
  const query = "CALL sp_buscar_nominas_por_empleado(?)";
  db.query(query, [termino], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

NominaModel.obtenerNominasPorEmpleado = (id_empleado, callback) => {
  const query = "CALL sp_listar_nominas_por_empleado(?)";
  db.query(query, [id_empleado], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};


module.exports = NominaModel;
