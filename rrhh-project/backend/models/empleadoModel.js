const db = require('../config/db');

const ejecutarSP = (accion, args) => {
  const sql = 'CALL sp_gestion_empleado(?,?,?,?,?,?,?,?,?,?,?,?)';
  const params = [
    accion,
    args.id_empleado  || null,
    args.nombres      || '',
    args.apellidos    || '',
    args.dpi          || '',
    args.email        || '',
    args.telefono     || '',
    args.fecha_contratacion || null,
    args.salario_base || null,
    args.id_puesto    || null,
    args.id_departamento|| null,
    args.id_estado    || null
  ];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

module.exports = {
  listarEmpleados: () => ejecutarSP('LISTAR', {}),
  obtenerEmpleado: id => ejecutarSP('CONSULTAR', { id_empleado: id }),
  crearEmpleado: args => ejecutarSP('INSERTAR', args),
  actualizarEmpleado: (id, args) => ejecutarSP('ACTUALIZAR', { ...args, id_empleado: id }),
  eliminarEmpleado: id => ejecutarSP('ELIMINAR', { id_empleado: id }),
  listarPuestos: () => new Promise((resolve, reject) => {
    db.query('CALL sp_listar_puestos()', (err, results) => err ? reject(err) : resolve(results[0]));
  }),
  listarDepartamentos: () => new Promise((resolve, reject) => {
    db.query('CALL sp_listar_departamentos()', (err, results) => err ? reject(err) : resolve(results[0]));
  }),
  listarEstados: () => new Promise((resolve, reject) => {
    db.query('CALL sp_listar_estados()', (err, results) => err ? reject(err) : resolve(results[0]));
  }),

  obtenerHorasExtrasMesActual: (id_empleado) => new Promise((resolve, reject) => {
    db.query('CALL sp_horas_extras_mes_actual(?)', [id_empleado], (err, results) => {
      if (err) return reject(err);
      resolve(results[0][0]); // { horas_extras_mes: X }
    });
  }),

listarDiasCalendarioMes: (id_empleado, mes, anio) => new Promise((resolve, reject) => {
  db.query('CALL sp_listar_dias_mes(?, ?, ?)', [id_empleado, mes, anio], (err, results) => {
    if (err) return reject(err);
    const fechas = results[0].map(row => ({
      fecha: row.fecha.toISOString().split('T')[0],
      tipo: row.tipo
    }));
    resolve(fechas);
  });
}),


eliminarDiasCalendarioMesActual: (id_empleado) => new Promise((resolve, reject) => {
  db.query('CALL sp_eliminar_dias_mes_actual(?)', [id_empleado], (err) => {
    if (err) return reject(err);
    resolve();
  });
}),

insertarDiaCalendario: (id_empleado, fecha, tipo, id_ciclo) => new Promise((resolve, reject) => {
  db.query('CALL sp_insertar_dia_calendario(?, ?, ?, ?, ?)', 
    [id_empleado, fecha, tipo, id_ciclo || null, `Ingreso manual como ${tipo}`],
    (err) => {
      if (err) return reject(err);
      resolve();
  });
}),


  listarPuestosPorDepartamento: (id_departamento) => new Promise((resolve, reject) => {
    db.query('CALL sp_listar_puestos_por_departamento(?)', [id_departamento], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  }),
  

  listarHorasExtraMesActual: (id_empleado) => new Promise((resolve, reject) => {
    db.query('CALL sp_listar_horas_extra_mes_actual(?)', [id_empleado], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // array de registros
    });
  }),
  
  insertarHoraExtra: (id_empleado, fecha, horas) => new Promise((resolve, reject) => {
    db.query('CALL sp_insertar_horas_extra(?, ?, ?)', [id_empleado, fecha, horas], (err, results) => {
      if (err) return reject(err);
      resolve({ msg: 'Hora extra insertada correctamente' });
    });
  }),

obtenerCicloVacaciones: (id_empleado) => new Promise((resolve, reject) => {
  db.query('CALL sp_obtener_ciclo_vacaciones(?)', [id_empleado], (err, results) => {
    if (err) return reject(err);
    resolve(results[0][0]); // devuelve un solo ciclo activo
  });
}),


// GUARDAR o ACTUALIZAR Bono Incentivo
guardarBonoIncentivo: (id_empleado, monto, activo) => new Promise((resolve, reject) => {
  db.query('CALL sp_guardar_bono_incentivo(?, ?, ?)', [id_empleado, monto, activo], (err) => {
    if (err) return reject(err);
    resolve({ msg: '✅ Bono incentivo guardado correctamente' });
  });
}),

// OBTENER Bono Incentivo
obtenerBonoIncentivo: (id_empleado) => new Promise((resolve, reject) => {
  db.query('CALL sp_obtener_bono_incentivo(?)', [id_empleado], (err, results) => {
    if (err) return reject(err);
    resolve(results[0][0] || { monto: 0, esta_activo: 0 }); // por si no tiene bono aún
  });
}),


  
  
};

