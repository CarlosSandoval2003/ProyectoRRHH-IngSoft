const Empleado = require('../models/empleadoModel');

// Selects
exports.listarPuestos = async (req, res) => {
  try {
    const datos = await Empleado.listarPuestos();
    res.json(datos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.listarDepartamentos = async (req, res) => {
  try {
    const datos = await Empleado.listarDepartamentos();
    res.json(datos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.listarEstados = async (req, res) => {
  try {
    const datos = await Empleado.listarEstados();
    res.json(datos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CRUD via SP central
exports.listarEmpleados = async (req, res) => {
  try {
    const datos = await Empleado.listarEmpleados();
    res.json(datos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerEmpleado = async (req, res) => {
  try {
    const datos = await Empleado.obtenerEmpleado(req.params.id);
    res.json(datos[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearEmpleado = async (req, res) => {
  try {
    await Empleado.crearEmpleado(req.body);
    res.json({ msg: 'Empleado creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarEmpleado = async (req, res) => {
  try {
    await Empleado.actualizarEmpleado(req.params.id, req.body);
    res.json({ msg: 'Empleado actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarEmpleado = async (req, res) => {
  try {
    await Empleado.eliminarEmpleado(req.params.id);
    res.json({ msg: 'Empleado eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.obtenerHorasExtrasMesActual = async (req, res) => {
  try {
    const data = await Empleado.obtenerHorasExtrasMesActual(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarHorasExtraMesActual = async (req, res) => {
  try {
    const data = await Empleado.listarHorasExtraMesActual(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.insertarHoraExtra = async (req, res) => {
  const { fecha, horas } = req.body;
  const id = req.params.id;
  try {
    const data = await Empleado.insertarHoraExtra(id, fecha, horas);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.listarPuestosPorDepartamento = async (req, res) => {
  try {
    const datos = await Empleado.listarPuestosPorDepartamento(req.params.id);
    res.json(datos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.listarDiasCalendarioMesActual = async (req, res) => {
  const { id } = req.params;
  const mes = parseInt(req.query.mes) || new Date().getMonth() + 1;
  const anio = parseInt(req.query.anio) || new Date().getFullYear();

  try {
    const fechas = await Empleado.listarDiasCalendarioMes(id, mes, anio);
    res.json(fechas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.guardarDiasCalendarioMesActual = async (req, res) => {
  const { id } = req.params;
  const { laborados, vacaciones, id_ciclo } = req.body;

  try {
    await Empleado.eliminarDiasCalendarioMesActual(id);

    for (const fecha of laborados) {
      await Empleado.insertarDiaCalendario(id, fecha, 'Laborado', null);
    }

    for (const fecha of vacaciones) {
      await Empleado.insertarDiaCalendario(id, fecha, 'Vacación', id_ciclo);
    }

    res.json({ msg: '✅ Calendario actualizado correctamente.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerCicloVacaciones = async (req, res) => {
  try {
    const data = await Empleado.obtenerCicloVacaciones(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



