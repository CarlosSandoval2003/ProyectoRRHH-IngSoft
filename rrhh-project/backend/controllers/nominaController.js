
const NominaModel = require('../models/nominaModel');

exports.getEmpleados = (req, res) => {
  NominaModel.obtenerEmpleadosActivos((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getTiposNomina = (req, res) => {
  NominaModel.obtenerTiposNomina((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getDepartamentos = (req, res) => {
  NominaModel.obtenerDepartamentos((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getListadoNominas = (req, res) => {
  NominaModel.obtenerListadoNominas((err, results) => {
    if (err) {
      console.error('Error al obtener listado de nóminas:', err);
      return res.status(500).json({ mensaje: 'Error al obtener el listado de nóminas' });
    }
    res.json(results);
  });
};


exports.generarNominaMasiva = (req, res) => {
  const { fecha_nomina, id_tipo_nomina, id_estado, mes, anio } = req.body;

if (!fecha_nomina || !id_tipo_nomina || !id_estado || !mes || !anio) {
  return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
}

const params = [fecha_nomina, id_tipo_nomina, id_estado, mes, anio];


  NominaModel.generarNominaTodos(params, (err, results) => {
    if (err) {
      console.error("Error al generar nómina masiva:", err);
      return res.status(500).json({ mensaje: "Error al generar nómina masiva.", error: err.sqlMessage || err });
    }
    res.status(200).json({ mensaje: "Nómina generada exitosamente para todos los empleados." });
  });
};

exports.generarNominaPorDepartamento = (req, res) => {
  const { id_departamento, fecha_nomina, id_tipo_nomina, id_estado, mes, anio } = req.body;

if (!id_departamento || !fecha_nomina || !id_tipo_nomina || !id_estado || !mes || !anio) {
  return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
}

const params = [id_departamento, fecha_nomina, id_tipo_nomina, id_estado, mes, anio];


  NominaModel.generarNominaPorDepartamento(params, (err, results) => {
    if (err) {
      console.error("Error al generar nómina por departamento:", err);
      return res.status(500).json({ mensaje: "Error al generar nómina por departamento.", error: err.sqlMessage || err });
    }
    res.status(200).json({ mensaje: "Nómina generada exitosamente para el departamento." });
  });
};


exports.getEmpleadosPorDepartamento = (req, res) => {
  const { id_departamento } = req.params;
  NominaModel.obtenerEmpleadosPorDepartamento(id_departamento, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getDetalleNominaPorGrupo = (req, res) => {
  const { fecha_nomina, id_tipo_nomina } = req.params;

  NominaModel.obtenerDetalleNominaPorGrupo(fecha_nomina, id_tipo_nomina, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getDetalleNominaEmpleado = (req, res) => {
  const { id_nomina } = req.params;
  NominaModel.obtenerDetalleNominaEmpleado(id_nomina, (err, results) => {
    if (err) {
      console.error('Error al obtener detalle de empleado:', err);
      return res.status(500).json({ mensaje: 'Error al obtener detalle de empleado.' });
    }
    res.json(results);
  });
};




exports.getTodosLosEmpleados = (req, res) => {
  NominaModel.obtenerTodosLosEmpleados((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.buscarEmpleados = (req, res) => {
  const { termino } = req.params;
  NominaModel.buscarEmpleados(termino, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};



exports.generarNominaEmpleado = (req, res) => {
  const {
  id_empleado, id_tipo_nomina, id_estado, fecha_nomina, mes, anio, id_departamento
} = req.body;

if (!id_empleado || !fecha_nomina || !id_tipo_nomina || !id_estado || !mes || !anio) {
  return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
}

const params = [id_empleado, fecha_nomina, id_tipo_nomina, id_estado, mes, anio, id_departamento];
NominaModel.generarNominaEmpleado(params, (err, results) => {
  if (err) return res.status(500).json({ error: err });
  res.json({ msg: 'Nómina generada exitosamente', results });
});





  
};

exports.buscarNominasPorEmpleado = (req, res) => {
  const { termino } = req.params;
  NominaModel.buscarNominasPorEmpleado(termino, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getNominasEmpleado = (req, res) => {
  const { id_empleado } = req.params;
  NominaModel.obtenerNominasPorEmpleado(id_empleado, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
