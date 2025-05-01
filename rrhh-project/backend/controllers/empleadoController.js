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
