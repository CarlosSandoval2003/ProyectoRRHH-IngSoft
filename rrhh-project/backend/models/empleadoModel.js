const db = require('../config/db');

const ejecutarSP = (accion, args) => {
  const sql = 'CALL sp_gestion_empleado(?,?,?,?,?,?,?,?,?,?,?,?,?)';
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
    args.dias_trabajados|| null,
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
};