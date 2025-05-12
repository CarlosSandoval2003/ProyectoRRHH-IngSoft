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

exports.listarDiasTrabajadosMesActual = async (req, res) => {
  try {
    const fechas = await Empleado.listarDiasTrabajadosMesActual(req.params.id);
    res.json(fechas);
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



exports.guardarDiasTrabajadosMesActual = async (req, res) => {
  const { id } = req.params;
  const fechas = req.body.fechas || []; // array de strings 'YYYY-MM-DD'

  try {
    await Empleado.eliminarDiasTrabajadosMesActual(id);

    for (const fecha of fechas) {
      await Empleado.insertarDiaTrabajado(id, fecha);
    }

    res.json({ msg: '✅ Días trabajados actualizados correctamente.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
